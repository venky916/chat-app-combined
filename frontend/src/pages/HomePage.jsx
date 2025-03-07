import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Login from '@/components/auth/Login';
import SignUp from '@/components/auth/SignUp';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '@/context/ChatProvider';

const HomePage = () => {
  const navigate = useNavigate();
  const { setUser } = ChatState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUser(user);
    if (user) {
      navigate('/chat');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center max-w-xl mx-auto">
      {/* header */}
      <div className="bg-white flex justify-center items-center w-full border-[1px] rounded-lg mt-10  mb-5">
        <h1 className="text-4xl font-workSans p-1">Let's Chat</h1>
      </div>

      <Card className="w-full bg-white p-4 rounded-lg border-1 font-workSans">
        <Tabs defaultValue="login">
          <TabsList className="w-full ">
            <TabsTrigger value="login" className="w-full font-bold">
              Log In
            </TabsTrigger>
            <TabsTrigger value="signup" className="w-full font-bold">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <SignUp />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default HomePage;
