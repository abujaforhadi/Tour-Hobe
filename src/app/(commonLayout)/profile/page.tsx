import ProfilePage from '@/components/modules/profile/ProfilePage';
import LoaderWrapper from '@/lib/LoaderWrapper';



const ProfilePageInside = () => {
   
    return (
       <div>
        <LoaderWrapper>
         <ProfilePage/>
         </LoaderWrapper>
       </div>
    );
};

export default ProfilePageInside;