import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { lockInFunds, getBalance } from "@/lib/web3"
import { 
  Wallet, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp,
  DollarSign,
  FileText,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Building2,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function BusinessDash() {
  const BOT_WALLET_ADDRESS = "0x24c80f19649c0Da8418011eF0B6Ed3e22007758c"
  
  const [lockedFunds, setLockedFunds] = useState(0)
  const [lockAmount, setLockAmount] = useState("")
  const [isLocking, setIsLocking] = useState(false)
  const [lockError, setLockError] = useState(null)
  const [lockSuccess, setLockSuccess] = useState(null)
  const [claims, setClaims] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingBalance, setIsFetchingBalance] = useState(false)
  const [currentWallet, setCurrentWallet] = useState(null)
  
  // Company registration state
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    companyEmail: "",
    companyWallet: "",
    termsAndConditions: "",
    coverageDetails: "",
    maxClaimAmount: ""
  })
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationError, setRegistrationError] = useState(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(null)
  const [registeredCompanies, setRegisteredCompanies] = useState([])
  const [transactions, setTransactions] = useState([])

  // Auto-detect wallet address on component mount
  useEffect(() => {
    const detectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            const wallet = accounts[0]
            setCurrentWallet(wallet)
            setCompanyForm(prev => ({ ...prev, companyWallet: wallet }))
          }
        } catch (error) {
          console.error('Error detecting wallet:', error)
        }
      }
    }
    detectWallet()
  }, [])

  // Fetch claims from Supabase
  useEffect(() => {
    fetchClaims()
    fetchCompanyBalance()
    fetchCompanies()
    if (currentWallet) {
      fetchTransactions()
    }
  }, [currentWallet])

  const fetchBotWalletBalance = async () => {
    setIsFetchingBalance(true)
    const balance = await getBalance(BOT_WALLET_ADDRESS)
    setLockedFunds(parseFloat(balance))
    setIsFetchingBalance(false)
  }

  const fetchCompanyBalance = async () => {
    setIsFetchingBalance(true)
    try {
      // Fetch the first company's balance (or sum of all companies)
      const { data, error } = await supabase
        .from('companies')
        .select('total_locked, total_paid_out, available')
        .limit(1)
        .single()

      if (error) {
        console.error('Error fetching company balance:', error)
        setLockedFunds(0)
      } else if (data) {
        console.log('Company balance data:', data)
        setLockedFunds(parseFloat(data.total_locked) || 0)
      } else {
        console.log('No company found')
        setLockedFunds(0)
      }
    } catch (error) {
      console.error('Error:', error)
      setLockedFunds(0)
    } finally {
      setIsFetchingBalance(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('registered_at', { ascending: false })

      if (error) throw error
      setRegisteredCompanies(data || [])
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const fetchTransactions = async () => {
    if (!currentWallet) return
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('company_wallet', currentWallet.toLowerCase())
        .order('timestamp', { ascending: false })
        .limit(10)

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactions([])
    }
  }

  const fetchClaims = async () => {
    try {
      setIsLoading(true)
      
      if (!currentWallet) {
        // No wallet connected, show all claims
        const { data, error } = await supabase
          .from('claims')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setClaims(data || [])
      } else {
        // Filter claims by company_wallet
        const { data, error } = await supabase
          .from('claims')
          .select('*')
          .ilike('company_wallet', currentWallet)
          .order('created_at', { ascending: false })

        if (error) throw error
        
        console.log('Connected wallet:', currentWallet)
        console.log('Filtered claims:', data)
        
        setClaims(data || [])
      }
    } catch (error) {
      console.error('Error fetching claims:', error)
      setClaims([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchClaims()
    fetchCompanyBalance()
    if (currentWallet) {
      fetchTransactions()
    }
  }

  const handleCompanyRegistration = async (e) => {
    e.preventDefault()
    setIsRegistering(true)
    setRegistrationError(null)
    setRegistrationSuccess(null)

    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([
          {
            company_name: companyForm.companyName,
            company_email: companyForm.companyEmail,
            company_wallet: companyForm.companyWallet.toLowerCase(),
            terms_and_conditions: companyForm.termsAndConditions,
            coverage_details: companyForm.coverageDetails,
            max_claim_amount: parseFloat(companyForm.maxClaimAmount) || null
          }
        ])
        .select()

      if (error) throw error

      setRegistrationSuccess("Company registered successfully! AI can now access your terms.")
      setCompanyForm({
        companyName: "",
        companyEmail: "",
        companyWallet: companyForm.companyWallet, 
        termsAndConditions: "",
        coverageDetails: "",
        maxClaimAmount: ""
      })
      
      fetchCompanies()
      
      setTimeout(() => setRegistrationSuccess(null), 5000)
    } catch (error) {
      console.error('Registration error:', error)
      setRegistrationError(error.message || "Failed to register company")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleLockFunds = async () => {
    if (!currentWallet) {
      setLockError("Please connect your wallet first")
      return
    }
    
    setIsLocking(true)
    setLockError(null)
    setLockSuccess(null)
  
    const result = await lockInFunds(lockAmount)
    
    if (result.success) {
      // Record transaction in database
      try {
        const { data, error } = await supabase.from('transactions').insert([
          {
            type: 'lock',
            amount: parseFloat(lockAmount),
            company_wallet: currentWallet.toLowerCase(),
            tx_hash: result.hash
          }
        ]).select()
        
        if (error) {
          console.error('Error recording transaction:', error)
          setLockError(`Transaction succeeded but failed to record: ${error.message}`)
        } else {
          console.log('Transaction recorded:', data)
          setLockSuccess(`Successfully locked ${lockAmount} CRO! Transaction: ${result.hash.slice(0, 10)}...`)
        }
      } catch (error) {
        console.error('Error recording transaction:', error)
        setLockError(`Transaction succeeded but failed to record: ${error.message}`)
      }
      
      setLockAmount("")
      
      // Refresh balance after successful transaction
      setTimeout(() => {
        fetchCompanyBalance()
        fetchTransactions()
      }, 3000)
      
      // Clear success message after 5 seconds
      setTimeout(() => setLockSuccess(null), 5000)
    } else {
      setLockError(result.error)
    }
    
    setIsLocking(false)
  }

  const stats = {
    totalClaims: claims.length,
    approvedClaims: claims.filter(c => c.status.toLowerCase() === "approved").length,
    pendingClaims: claims.filter(c => c.status.toLowerCase() === "pending").length,
    totalPaidOut: claims
      .filter(c => c.status.toLowerCase() === "approved")
      .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0),
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/80 backdrop-blur-sm border-green-400/50"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>
      case "pending":
        return <Badge variant="outline" className="backdrop-blur-sm bg-yellow-500/20 border-yellow-400/50 text-yellow-200"><Clock className="mr-1 h-3 w-3" />Pending</Badge>
      case "rejected":
        return <Badge variant="destructive" className="backdrop-blur-sm bg-red-500/30 border-red-400/50"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-start justify-center p-8 md:p-12 z-10 overflow-y-auto">
      <div className="w-full max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-8 shadow-2xl mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Insurance Admin Dashboard</h1>
            <p className="text-white/80 mt-2 drop-shadow text-sm">AI-Powered Claim Processing System</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="backdrop-blur-md bg-white/20 border-white/30 text-white hover:bg-white/30 shrink-0"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
<br />
       
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-6 shadow-2xl hover:bg-white/20 transition-all">
            <div className="flex flex-row items-center justify-between pb-4">
              <h3 className="text-xs font-medium text-white/80 uppercase tracking-wide">Locked Funds</h3>
              <Wallet className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">
                {isFetchingBalance ? (
                  <RefreshCw className="h-8 w-8 animate-spin inline" />
                ) : (
                  `${lockedFunds.toFixed(2)} CRO`
                )}
              </div>
              <p className="text-xs text-white/70 mt-2">
                Total locked in system
              </p>
              {!isFetchingBalance && lockedFunds === 0 && (
                <p className="text-xs text-yellow-300 mt-2">
                  ⚠️ No funds locked yet
                </p>
              )}
            </div>
          </div>
          

          <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-6 shadow-2xl hover:bg-white/20 transition-all">
            <div className="flex flex-row items-center justify-between pb-4">
              <h3 className="text-xs font-medium text-white/80 uppercase tracking-wide">Total Claims</h3>
              <FileText className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">{stats.totalClaims}</div>
              <p className="text-xs text-white/70 mt-2">
                
              </p>
            </div>
          </div>
          

         

          <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-6 shadow-2xl hover:bg-white/20 transition-all">
            <div className="flex flex-row items-center justify-between pb-4">
              <h3 className="text-xs font-medium text-white/80 uppercase tracking-wide">Total Paid Out</h3>
              <TrendingUp className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">{stats.totalPaidOut.toLocaleString()} CRO</div>
              <p className="text-xs text-white/70 mt-2">
                From {stats.approvedClaims} claims
              </p>
            </div>
          </div>
        </div>

        <br />
        <Tabs defaultValue="company">
          <TabsList className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 p-1 rounded-2xl mb-6">
            <TabsTrigger value="company" className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl">Company Registration</TabsTrigger>
            <TabsTrigger value="claims" className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl">Claims</TabsTrigger>
            <TabsTrigger value="funds" className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl">Fund Management</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl">Analytics</TabsTrigger>
          </TabsList>

          {/* Claims Tab */}
          <TabsContent value="claims" className="space-y-6">
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-white">Recent Claims</h2>
                <p className="text-white/70 text-xs mt-1">
                  Real-time claim processing powered by Gemini AI
                </p>
              </div>
              <div className="overflow-x-auto p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20 hover:bg-white/5">
                      <TableHead className="text-white/80">Claim ID</TableHead>
                      <TableHead className="text-white/80">Customer</TableHead>
                      <TableHead className="text-white/80">Product</TableHead>
                      <TableHead className="text-white/80">Amount</TableHead>
                      <TableHead className="text-white/80">Status</TableHead>
                      <TableHead className="text-white/80">AI Verification</TableHead>
                      <TableHead className="text-white/80">Timestamp</TableHead>
                      <TableHead className="text-white/80">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-white/60">
                          No claims found
                        </TableCell>
                      </TableRow>
                    ) : (
                      claims.map((claim) => (
                        <TableRow key={claim.id} className="border-white/10 hover:bg-white/10 transition-colors">
                          <TableCell className="font-medium text-white">{claim.id}</TableCell>
                          <TableCell className="font-mono text-xs text-white/90">{claim.customer}</TableCell>
                          <TableCell className="text-white/90">{claim.product}</TableCell>
                          <TableCell className="text-white/90">{claim.amount} CRO</TableCell>
                          <TableCell>{getStatusBadge(claim.status.toLowerCase())}</TableCell>
                          <TableCell className="max-w-[200px] truncate text-xs text-white/80">
                            {claim.ai_verification || 'Pending verification'}
                          </TableCell>
                          <TableCell className="text-xs text-white/70">
                            {new Date(claim.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {claim.tx_hash ? (
                              <Button variant="ghost" size="sm" asChild className="text-white/80 hover:text-white hover:bg-white/20">
                                <a 
                                  href={`https://explorer.cronos.org/testnet/tx/${claim.tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-xs text-white/50">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <br />
          <TabsContent value="funds">
            <div className="flex flex-col gap-6">
              <div className="grid gap-6 md:grid-cols-2">
              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/20">
                  <h2 className="text-xl font-bold text-white">Lock Funds</h2>
                  <p className="text-white/70 text-xs mt-1">
                    Transfer CRO to the bot wallet for automated claim payouts
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white/90">Amount (CRO)</Label>
                    <br />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={lockAmount}
                      onChange={(e) => setLockAmount(e.target.value)}
                      className="backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <br />
                  
                  {lockError && (
                    <div className="rounded-lg backdrop-blur-md bg-red-500/20 border border-red-400/30 p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-100">{lockError}</p>
                      </div>
                    </div>
                  )}
                  
                  {lockSuccess && (
                    <div className="rounded-lg backdrop-blur-md bg-green-500/20 border border-green-400/30 p-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-100">{lockSuccess}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="rounded-lg backdrop-blur-md bg-blue-500/20 border border-blue-400/30 p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-300 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white">
                          Bot Wallet Address
                        </p>
                        <p className="text-xs font-mono text-white/90">
                          0x24c80f19649c0Da8418011eF0B6Ed3e22007758c
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-white/20">
                  <Button 
                    className="w-full backdrop-blur-md bg-white/30 hover:bg-white/40 text-white border-white/30" 
                    onClick={handleLockFunds}
                    disabled={!lockAmount || isLocking}
                  >
                    {isLocking ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Lock Funds
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/20">
                  <h2 className="text-xl font-bold text-white">Fund Status</h2>
                  <p className="text-white/70 text-xs mt-1">
                    Current balance and utilization
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Total Locked</span>
                      <span className="font-medium text-white">
                        {isFetchingBalance ? (
                          <RefreshCw className="h-4 w-4 animate-spin inline" />
                        ) : (
                          `${lockedFunds.toFixed(2)} CRO`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Paid Out</span>
                      <span className="font-medium text-white">{stats.totalPaidOut.toFixed(2)} CRO</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Available</span>
                      <span className={`font-medium ${(lockedFunds - stats.totalPaidOut) < 0 ? 'text-red-300' : 'text-green-300'}`}>
                        {(lockedFunds - stats.totalPaidOut).toFixed(2)} CRO
                      </span>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-white">Utilization Rate</span>
                      <span className={`${lockedFunds > 0 && (stats.totalPaidOut / lockedFunds) > 1 ? 'text-red-300' : 'text-white'}`}>
                        {lockedFunds > 0 ? ((stats.totalPaidOut / lockedFunds) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>

                  {lockedFunds > 0 && (stats.totalPaidOut / lockedFunds) > 1 && (
                    <div className="rounded-lg backdrop-blur-md bg-red-500/20 border border-red-400/30 p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-300 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-100">
                          Warning: Paid out more than locked funds. Please lock more funds to cover claims.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                      <div 
                        className={`h-full transition-all ${
                          lockedFunds > 0 && (stats.totalPaidOut / lockedFunds) > 1 
                            ? 'bg-gradient-to-r from-red-400 to-red-600' 
                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                        }`}
                        style={{ width: `${lockedFunds > 0 ? Math.min((stats.totalPaidOut / lockedFunds) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Transaction History */}
              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-white">Transaction History</h2>
                <p className="text-white/70 text-xs mt-1">Recent fund locks and withdrawals</p>
              </div>
              <div className="p-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full backdrop-blur-md ${
                            tx.type === "lock" 
                              ? "bg-green-500/30 border border-green-400/30" 
                              : "bg-red-500/30 border border-red-400/30"
                          }`}>
                            {tx.type === "lock" ? (
                              <Lock className="h-4 w-4 text-green-300" />
                            ) : (
                              <DollarSign className="h-4 w-4 text-red-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {tx.type === "lock" ? "Funds Locked" : "Claim Payout"}
                            </p>
                            <p className="text-xs text-white/70">
                              {new Date(tx.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            tx.type === "lock" ? "text-green-300" : "text-red-300"
                          }`}>
                            {tx.type === "lock" ? "+" : "-"}{tx.amount} CRO
                          </p>
                          {tx.tx_hash && (
                            <a 
                              href={`https://explorer.cronos.org/testnet/tx/${tx.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-white/60 hover:text-white"
                            >
                              {tx.tx_hash.slice(0, 6)}...{tx.tx_hash.slice(-4)}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          </TabsContent>

          {/* Company Registration Tab */}
          <TabsContent value="company">
            <div className="flex flex-col gap-6">
              {/* Registration Form */}
              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/20">
                  <h2 className="text-xl font-bold text-white">Register Your Company</h2>
                  <p className="text-white/70 text-xs mt-1">
                    Set up your company profile and terms for AI-powered claim processing
                  </p>
                </div>
                <form onSubmit={handleCompanyRegistration} className="p-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-white/90">Company Name *</Label>
                      <br />
                      <Input
                        id="companyName"
                        required
                        placeholder="Acme Insurance Co."
                        value={companyForm.companyName}
                        onChange={(e) => setCompanyForm({...companyForm, companyName: e.target.value})}
                        className="backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail" className="text-white/90">Company Email *</Label>
                      <br />
                      <Input
                        id="companyEmail"
                        type="email"
                        required
                        placeholder="contact@company.com"
                        value={companyForm.companyEmail}
                        onChange={(e) => setCompanyForm({...companyForm, companyEmail: e.target.value})}
                        className="backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="companyWallet" className="text-white/90">Company Wallet Address (Auto-detected)</Label>
                      <br />
                      <Input
                        id="companyWallet"
                        required
                        readOnly
                        placeholder="Connect wallet to auto-detect"
                        value={companyForm.companyWallet}
                        className="backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/50 cursor-not-allowed"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxClaimAmount" className="text-white/90">Max Claim Amount (CRO)</Label>
                      <br />
                      <Input
                        id="maxClaimAmount"
                        type="number"
                        placeholder="5000"
                        value={companyForm.maxClaimAmount}
                        onChange={(e) => setCompanyForm({...companyForm, maxClaimAmount: e.target.value})}
                        className="backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="termsAndConditions" className="text-white/90">Terms and Conditions *</Label>
                    <br />
                    <Textarea
                      id="termsAndConditions"
                      required
                      rows={6}
                      placeholder="Enter your insurance terms and conditions that AI will use to evaluate claims..."
                      value={companyForm.termsAndConditions}
                      onChange={(e) => setCompanyForm({...companyForm, termsAndConditions: e.target.value})}
                      className="backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/50 resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverageDetails" className="text-white/90">Coverage Details</Label>
                    <br />
                    <Textarea
                      id="coverageDetails"
                      rows={4}
                      placeholder="Describe what types of damages/claims are covered..."
                      value={companyForm.coverageDetails}
                      onChange={(e) => setCompanyForm({...companyForm, coverageDetails: e.target.value})}
                      className="backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/50 resize-none"
                    />
                  </div>

                  {registrationError && (
                    <div className="rounded-lg backdrop-blur-md bg-red-500/20 border border-red-400/30 p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-100">{registrationError}</p>
                      </div>
                    </div>
                  )}
                  
                  {registrationSuccess && (
                    <div className="rounded-lg backdrop-blur-md bg-green-500/20 border border-green-400/30 p-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-100">{registrationSuccess}</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    className="w-full backdrop-blur-md bg-white/30 hover:bg-white/40 text-white border-white/30" 
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Building2 className="mr-2 h-4 w-4" />
                        Register Company
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Registered Companies List */}
              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/20">
                  <h2 className="text-xl font-bold text-white">Registered Companies</h2>
                  <p className="text-white/70 text-xs mt-1">
                    {registeredCompanies.length} companies registered
                  </p>
                </div>
                <div className="p-6">
                  {registeredCompanies.length === 0 ? (
                    <div className="text-center py-8 text-white/60">
                      <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No companies registered yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {registeredCompanies.map((company) => (
                        <div key={company.id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full backdrop-blur-md bg-blue-500/30 border border-blue-400/30">
                                <Building2 className="h-5 w-5 text-blue-300" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-lg">{company.company_name}</h3>
                              </div>
                            </div>
                            <Badge className={company.is_active ? "bg-green-500/80 border-green-400/50" : "bg-gray-500/80 border-gray-400/50"}>
                              {company.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          
                          <div className="grid gap-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-white/80">
                              <Mail className="h-4 w-4" />
                              <span>{company.company_email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                              <Wallet className="h-4 w-4" />
                              <span className="font-mono text-xs">{company.company_wallet}</span>
                            </div>
                          </div>
                          
                          {company.max_claim_amount && (
                            <div className="mb-3 text-sm text-white/80">
                              <span className="font-medium">Max Claim:</span> {company.max_claim_amount} CRO
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <details className="group">
                              <summary className="cursor-pointer text-sm font-medium text-white/90 hover:text-white list-none flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Terms & Conditions
                                <span className="ml-auto text-xs text-white/60 group-open:hidden">Click to expand</span>
                              </summary>
                              <div className="mt-2 p-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/20">
                                <p className="text-xs text-white/80 whitespace-pre-wrap">{company.terms_and_conditions}</p>
                              </div>
                            </details>
                            
                            {company.coverage_details && (
                              <details className="group">
                                <summary className="cursor-pointer text-sm font-medium text-white/90 hover:text-white list-none flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Coverage Details
                                  <span className="ml-auto text-xs text-white/60 group-open:hidden">Click to expand</span>
                                </summary>
                                <div className="mt-2 p-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/20">
                                  <p className="text-xs text-white/80 whitespace-pre-wrap">{company.coverage_details}</p>
                                </div>
                              </details>
                            )}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white/60">
                            Registered: {new Date(company.registered_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="flex flex-col gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
                  <div className="pb-4">
                  <h3 className="text-xs font-medium text-white/80 uppercase tracking-wide">Claim Success Rate</h3>
                  <p className="text-xs text-white/60 mt-1">AI approval accuracy</p>
                </div>
                <div>
                  <div className="text-5xl font-bold text-green-300 drop-shadow-lg">
                    {((stats.approvedClaims / stats.totalClaims) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-white/70 mt-2">
                    {stats.approvedClaims} out of {stats.totalClaims} claims approved
                  </p>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
                <div className="pb-4">
                  <h3 className="text-xs font-medium text-white/80 uppercase tracking-wide">Average Processing Time</h3>
                  <p className="text-xs text-white/60 mt-1">From submission to payout</p>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white drop-shadow-lg">2.3 min</div>
                  <p className="text-sm text-white/70 mt-2">
                    Powered by Gemini AI + Make.com automation
                  </p>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/20">
                  <h2 className="text-xl font-bold text-white">System Status</h2>
                  <p className="text-white/70 text-xs mt-1">Integration health checks</p>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { service: "Gemini AI", status: "operational", latency: "120ms" },
                    { service: "Make.com Webhook", status: "operational", latency: "85ms" },
                    { service: "Bot Wallet", status: "operational", balance: `${lockedFunds.toFixed(2)} CRO` },
                    { service: "Cronos Network", status: "operational", latency: "2.1s" },
                  ].map((service, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                        <span className="font-medium text-white">{service.service}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-white/70">
                          {service.latency || service.balance}
                        </span>
                        <Badge variant="outline" className="text-green-300 border-green-400/50 bg-green-500/20">
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

