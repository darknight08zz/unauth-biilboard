import Header from "../components/Header";
import Hero from "../components/Hero";
import ReportSection from "../components/ReportSection";
import Dashboard from "../components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <ReportSection />
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
