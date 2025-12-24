import RegisterForm from '@/components/modules/auth/RegisterForm/RegisterForm';
import LoaderWrapper from '@/lib/LoaderWrapper';


const RegisterPage = () => {
    return (
        <div>
            <LoaderWrapper>
            <RegisterForm />
            </LoaderWrapper>
        </div>
    );
};

export default RegisterPage;