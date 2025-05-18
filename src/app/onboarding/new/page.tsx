import { getAllDepartments } from "@/actions/getActions"
import OnBoardingClient from "@/pages/onboardingComponents"


export default async function OnBoardingPage() {
  const departments = await getAllDepartments()

  if(departments?.length === 0){
    return (
      <div>
        Error is there 
      </div>
    )
  }
  return (
  <OnBoardingClient departments={departments} />
)
}
