import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ChatProvider from './context/ChatProvider';

function App() {
  return (
    <div className="bg-img bg-cover h-screen z-0">
      <ChatProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
