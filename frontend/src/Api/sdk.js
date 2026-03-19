
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut,
    sendEmailVerification

} from 'firebase/auth';
import {auth} from '../firebase';
export const AuthSDK = {
    signup: async({username,email,password})=>{
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, {displayName: username});
            await sendEmailVerification(user);
            await signOut(auth);
            return {message: 'VErification email sent'};
        }catch(error){
            throw new Error(error.message);
        }
    },
    login: async (email,password)=>{
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();
            if(!user.emailVerified){
                await signOut(auth);
                throw new Error("Please verify your account before logging in");
            }
            localStorage.setItem("token", token);
            return {
                uid: user.uid,
                email: user.email,
                username: user.displayName,
            };
        }catch(err){
            throw new Error(err.message);
        }
    }
}