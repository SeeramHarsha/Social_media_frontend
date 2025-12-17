import { Footer } from "@/components/Footer";

export default function TermsOfService() {
    return (
        <div className="flex flex-col gap-8 p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
                <p>
                    By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.
                    If you do not agree with these terms, you are prohibited from using or accessing this site or using any other services provided by Social SaaS.
                </p>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">2. Use License</h2>
                <p>
                    Permission is granted to temporarily download one copy of the materials (information or software) on Social SaaS's website for personal,
                    non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                    <li>attempt to decompile or reverse engineer any software contained on Social SaaS's website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">3. Disclaimer</h2>
                <p>
                    The materials on Social SaaS's website are provided on an 'as is' basis. Social SaaS makes no warranties, expressed or implied,
                    and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                    fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">4. Limitations</h2>
                <p>
                    In no event shall Social SaaS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                    or due to business interruption) arising out of the use or inability to use the materials on Social SaaS's website, even if Social SaaS
                    or a Social SaaS authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
            </section>
            <Footer />
        </div>
    );
}
