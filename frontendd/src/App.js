import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import Rooms from '../../frontendd/src/pages/Rooms';
import Students from '../../frontendd/src/pages/Students';
import Payments from '../../frontendd/src/pages/Payments';
import Dashboard from '../../frontendd/src/pages/Dashboard';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Rooms />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/students" element={<Students />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;