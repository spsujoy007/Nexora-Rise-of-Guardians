import { Button } from "@/components/ui/Button";
import { useGuardianStore } from "@/store/useGuardianStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { app } from "../firebaseConfig";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function useGoogleAuth(options?: { onSuccess?: (user: any) => void }) {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = useGuardianStore((state) => state.login);

    // Restore Firebase user after page reload
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                login();
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [login]);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);

            const result = await signInWithPopup(
                auth,
                googleProvider
            );

            const googleUser = result.user;

            setUser(googleUser);

            if (options?.onSuccess) {
                options.onSuccess(googleUser);
            } else {
                login();
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Google Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const GoogleAuthButton = () => {
        return (
            <Button
                onClick={handleGoogleLogin}
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2
                            size={16}
                            className="animate-spin"
                        />
                        Signing in…
                    </>
                ) : (
                    <>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#fff"
                                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989z"
                            />
                        </svg>

                        Continue with Google
                    </>
                )}
            </Button>
        );
    };

    return {
        user,
        loading,
        handleGoogleLogin,
        GoogleAuthButton,
    };
}
