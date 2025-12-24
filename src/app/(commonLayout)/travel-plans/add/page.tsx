import AddPlan from "@/components/modules/plan/AddPlan";

import UserAuthWrapper from "@/lib/UserAuthWrapper";


const AddPlanPage = () => {
    return (
        <div>
            <UserAuthWrapper>
            <AddPlan/> 
           </UserAuthWrapper>
        </div>
    );
};

export default AddPlanPage;