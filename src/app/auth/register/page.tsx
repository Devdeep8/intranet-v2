import { getDepartments } from "@/actions/department"; // your getDepartments fn
import { registerUser } from "@/actions/registerAction";
import SubmitBtn from "@/components/reauable-button-from/submitBtn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function RegisterPage() {
  const departments = await getDepartments();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form action={registerUser} className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Fill in your details</p>
        </div>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              pattern="^[a-zA-Z]+\.prabisha@gmail\.com$"
              title="Email must be in the format firstname.prabisha@gmail.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <div>
            <Label htmlFor="departmentId">Department</Label>
            <select
              id="departmentId"
              name="departmentId"
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select department</option>
              {departments.map((dept :any) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <SubmitBtn text="Sign Up" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/auth/login" className="underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
