import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return(
        <main className="flex p-3 items-center justify-center h-screen">
            <SignIn />
        </main>
    )
}