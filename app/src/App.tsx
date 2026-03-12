import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isHome   = location.pathname === '/';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <TopBar />

      <main className="md:ml-14 lg:ml-52 pt-14 pb-20 md:pb-6">
        {isHome ? (
          /* HomePage gets NO padding — hero breaks out flush */
          children
        ) : (
          <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        )}
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
