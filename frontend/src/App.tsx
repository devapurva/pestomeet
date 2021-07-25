// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// hooks
import useAuth from './hooks/useAuth';
// components
import Settings from './components/settings';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import GoogleAnalytics from './components/GoogleAnalytics';
import NotistackProvider from './components/NotistackProvider';
import ThemePrimaryColor from './components/ThemePrimaryColor';

// ----------------------------------------------------------------------

export default function App() {
  const { isInitialized } = useAuth();

  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <NotistackProvider>
          <ScrollToTop />
          <GoogleAnalytics />
          {isInitialized ? <Router /> : <LoadingScreen />}
        </NotistackProvider>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
