import { Toaster } from "sonner";

const AuthLayout = ({
    children
}: {
   children:  React.ReactNode;
}) => {
    return (
        <main className='h-screen bg-[#111827] overflow-auto'>
            <div className="mx-auto max-w-screen-xl h-full w-full">
                {children}
                <Toaster />
            </div>
        </main>
    )
}

export default AuthLayout;