import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
            <div className="flex gap-4">
                <Link href="/privacy-policy" className="hover:underline">
                    Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="hover:underline">
                    Terms of Service
                </Link>
            </div>
        </footer>
    );
}
