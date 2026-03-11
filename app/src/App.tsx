import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar }        from '@/components/layout/Sidebar';
import { TopBar }         from '@/components/layout/TopBar';
import { MobileNav }      from '@/components/layout/MobileNav';
import { HomePage }       from '@/pages/HomePage';
import { DiscoverPage }   from '@/pages/DiscoverPage';
import { SeasonalPage }   from '@/pages/SeasonalPage';
import { ListsPage }      from '@/pages/ListsPage';
import { CommunityPage }  from '@/pages/CommunityPage';
import { ChallengesPage } from '@/pages/ChallengesPage';
import { StatsPage }      from '@/pages/StatsPage';
import { AnimePage }      from '@/pages/AnimePage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <TopBar />
      {/* md: offset 208px for fixed w-52 sidebar */}
      <main className="md:ml-52 pt-14 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"           element={<HomePage />}       />
          <Route path="/discover"   element={<DiscoverPage />}   />
          <Route path="/seasonal"   element={<SeasonalPage />}   />
          <Route path="/lists"      element={<ListsPage />}      />
          <Route path="/community"  element={<CommunityPage />}  />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/stats"      element={<StatsPage />}      />
          <Route path="/anime/:id"  element={<AnimePage />}      />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
