import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="flex flex-col gap-8 p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">1. Introduction</h2>
                <p>
                    Welcome to Social SaaS. We respect your privacy and are committed to protecting your personal data.
                    This privacy policy will inform you as to how we look after your personal data when you visit our website
                    (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                </p>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">2. Data We Collect</h2>
                <p>
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Identity Data includes first name, last name, username or similar identifier.</li>
                    <li>Contact Data includes email address and telephone numbers.</li>
                    <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                </ul>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
                <p>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                </ul>
            </section>
            <Footer />
        </div>
    );
}
