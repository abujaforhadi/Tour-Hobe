import LoginForm from "@/components/modules/auth/LoginForm/LoginForm";
import LoaderWrapper from "@/lib/LoaderWrapper";


const LoginPage = () => {
    return (
        <div>
            <LoaderWrapper>
            <LoginForm/>
            </LoaderWrapper>
        </div>
    );
};

export default LoginPage;