"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SubmitBtn( {text} : {text : string}) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button className="w-full"  disabled>
          <Loader2 className=" w-4 h-2 animate-spin mr-2 " /> Please wait....{" "}
        </Button>
      ) : (
        <Button className="w-full"  type="submit"> {text} </Button>
      )}
    </>
  );
}
