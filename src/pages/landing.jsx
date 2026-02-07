import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Dog from '../components/Dog'
import { Loader2, AlertCircle } from 'lucide-react' 
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { connectWallet } from '@/lib/web3'

const Landing = ({onConnect}) => {
    const [startAnimation, setStartAnimation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

  const handleConnect = async () => {
    setIsLoading(true); 
    setError(null);

    const result = await connectWallet();
    
    if (result.success) {
      setWalletAddress(result.address);
      localStorage.setItem('walletAddress', result.address);
      
    
      setStartAnimation(true);
      
      if(onConnect) onConnect();
      
      setTimeout(() => {
        setIsLoading(false); 
        navigate('/dashboard');
      }, 3500);
    } else {
      setIsLoading(false);
      setError(result.error);
    }
  };

  return (
    <>
    <Canvas><Dog isAnimating={startAnimation} /></Canvas>
    <div className='absolute inset-0 z-20 flex items-center justify-end p-20'>
      <div className='flex flex-col items-end gap-8'>
        
        <div className="text-7xl font-black text-white text-right leading-[0.9] tracking-tighter">
          AI BASED<br />
          INSURANCE<br />
          PROTOCOL
        </div>

        {error && (
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 max-w-md">
            <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        {walletAddress && !isLoading && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4">
            <p className="text-sm text-white/70 mb-1">Connected Wallet</p>
            <p className="text-white font-mono text-sm">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>
        )}

        <Button 
          variant='outline' 
          disabled={isLoading} 
          onClick={handleConnect}
          className="h-12 px-8 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isLoading ? "Connecting..." : walletAddress ? "Enter Dashboard" : "Connect Wallet"}
        </Button>

      </div>
    </div>
  </>)
}

export default Landing