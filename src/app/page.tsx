
import SendCreditForm from "./components/SendCreditForm";
import { supabase } from "@/lib/supabase";
import AutoCreateWallet from "./components/AutoCreateWallet";
import TotalTransfers from "./components/TotalTransfers";
import RecentTransactions from "./components/RecentTransactions";
import GrantCreditForm from "./components/GrantCreditForm";
import LandingHero from "./components/LandingHero";
import CreditActivityChart from "./components/CreditActivityChart";
import EcosystemStats from "./components/EcosystemStats";
import WhitepaperCard from "./components/WhitepaperCard";
import EcosystemSignals from "./components/EcosystemSignals";
import MyWalletPanel from "./components/MyWalletPanel";
import FAQCard from "./components/FAQCard";


export default async function Home() {
  

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <AutoCreateWallet />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <LandingHero />
        <MyWalletPanel />
<div className="mt-12">
  <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
  <CreditActivityChart />
  <EcosystemStats />
</section>
<section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
  <WhitepaperCard />
  <EcosystemSignals />
</section>
<section className="mt-8">
  <FAQCard />
</section>
</div>
        

        
      </div>
    </main>
  );
}