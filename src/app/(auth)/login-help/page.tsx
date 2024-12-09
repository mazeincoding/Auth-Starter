import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaKey } from "react-icons/fa";

interface HelpOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const helpOptions: HelpOption[] = [
  {
    icon: <FaKey className="flex-shrink-0" />,
    title: "Reset your password",
    description: "We'll send you a link to create a new password",
    href: "/forgot-password",
  },
];

export default function LoginHelp() {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-grow flex justify-center flex-col gap-5 px-8 pt-10">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold bg-gradient-to-t from-foreground/50 to-foreground bg-clip-text text-transparent">
                Need help logging in?
              </h1>
              <p className="text-foreground/35">
                We'll make it easy. What do you need help with?
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {helpOptions.map((option) => (
              <Link key={option.href} href={option.href}>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 px-6"
                >
                  <div className="flex gap-4 items-center">
                    {option.icon}
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{option.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
