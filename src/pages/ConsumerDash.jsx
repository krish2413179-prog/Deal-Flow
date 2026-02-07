import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { 
  Search,
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  ExternalLink,
  AlertCircle,
  Package,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function ConsumerDash() {
  const [walletAddress, setWalletAddress] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    setIsSearching(true)
    setError(null)
    setSearchResult(null)
    
    try {
      console.log('Searching for wallet:', walletAddress)
      
      // First try exact match on customer_wallet
      let { data, error } = await supabase
        .from('claims')
        .select('*')
        .ilike('customer_wallet', `${walletAddress}%`)
        .order('created_at', { ascending: false })
        .limit(1)

      // If no results, try searching in customer field
      if ((!data || data.length === 0) && !error) {
        const result = await supabase
          .from('claims')
          .select('*')
          .ilike('customer', `%${walletAddress}%`)
          .order('created_at', { ascending: false })
          .limit(1)
        
        data = result.data
        error = result.error
      }

      console.log('Search result:', data, 'Error:', error)

      if (error) {
        console.error('Search error:', error)
        setError('Error searching for claims')
        return
      }
      
      if (data && data.length > 0) {
        const claim = data[0]
        
        // Fetch timeline for this claim
        const { data: timeline, error: timelineError } = await supabase
          .from('claim_timeline')
          .select('*')
          .eq('claim_id', claim.id)
          .order('date', { ascending: true })

        if (!timelineError && timeline && timeline.length > 0) {
          claim.timeline = timeline
        } else {
          // Create default timeline based on status
          claim.timeline = [
            { status: "Submitted", date: claim.created_at, completed: true },
            { status: "AI Verification", date: claim.created_at, completed: claim.status.toLowerCase() !== 'pending' },
            { status: claim.status.toLowerCase() === 'approved' ? 'Approved' : claim.status.toLowerCase() === 'rejected' ? 'Rejected' : 'Processing', date: claim.updated_at, completed: claim.status.toLowerCase() !== 'pending' },
            { status: "Payment Sent", date: claim.processed_date, completed: claim.status.toLowerCase() === 'approved' && claim.tx_hash },
          ]
        }
        
        setSearchResult(claim)
      } else {
        setError('No claim found for this wallet address')
      }
    } catch (error) {
      console.error('Error searching claim:', error)
      setError('No claim found for this wallet address')
    } finally {
      setIsSearching(false)
    }
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
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Track Your Claim</h1>
            <p className="text-white/80 mt-2 drop-shadow text-sm">Enter your wallet address to check claim status</p>
          </div>
        </div>
        <br />

        
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet" className="text-white/90 text-base">Wallet Address</Label>
              <div className="flex gap-3">
                <Input
                  id="wallet"
                  type="text"
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/50 flex-1"
                />
                
                <Button 
                  onClick={handleSearch}
                  disabled={!walletAddress || isSearching}
                  className="backdrop-blur-md bg-white/30 hover:bg-white/40 text-white border-white/30 px-8"
                >
                  {isSearching ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-300 mt-2">{error}</p>
              )}
            </div>
            <br />
            <div className="rounded-lg backdrop-blur-md bg-blue-500/20 border border-blue-400/30 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-300 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    How to find your wallet address
                  </p>
                  <p className="text-xs text-white/90">
                    Your wallet address is the address you provided when submitting your claim. Check your email confirmation for the exact address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />

        
        {searchResult && (
          <div className="flex flex-col gap-6">
            {/* Claim Status Card */}
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Claim #{searchResult.id}</h2>
                    <p className="text-white/70 text-sm mt-1">{searchResult.product}</p>
                  </div>
                  {getStatusBadge(searchResult.status.toLowerCase())}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-white/70">Product</p>
                        <p className="text-white font-medium">{searchResult.product}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-white/70">Claim Amount</p>
                        <p className="text-white font-medium text-xl">{searchResult.amount} CRO</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-white/70">Submitted Date</p>
                        <p className="text-white font-medium">{new Date(searchResult.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-white/70">AI Verification</p>
                        <p className="text-white font-medium text-sm">{searchResult.ai_verification || 'Pending verification'}</p>
                      </div>
                    </div>

                    {searchResult.tx_hash && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
                          <ExternalLink className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-white/70">Transaction Hash</p>
                          <a 
                            href={`https://cronoscan.com/tx/${searchResult.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200 font-mono text-xs break-all underline"
                          >
                            {searchResult.tx_hash}
                          </a>
                        </div>
                      </div>
                    )}

                    {searchResult.status.toLowerCase() === 'approved' && searchResult.tx_hash && (
                      <div className="rounded-lg backdrop-blur-md bg-green-500/20 border border-green-400/30 p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-300" />
                          <div>
                            <p className="text-sm font-medium text-white">Payment Completed</p>
                            <p className="text-xs text-white/80">Funds sent to your wallet</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {searchResult.status.toLowerCase() === 'pending' && (
                      <div className="rounded-lg backdrop-blur-md bg-yellow-500/20 border border-yellow-400/30 p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-yellow-300" />
                          <div>
                            <p className="text-sm font-medium text-white">Processing</p>
                            <p className="text-xs text-white/80">AI is reviewing your claim</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {searchResult.status.toLowerCase() === 'rejected' && (
                      <div className="rounded-lg backdrop-blur-md bg-red-500/20 border border-red-400/30 p-4">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-red-300" />
                          <div>
                            <p className="text-sm font-medium text-white">Claim Rejected</p>
                            <p className="text-xs text-white/80">See AI verification for details</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-white">Claim Timeline</h2>
                <p className="text-white/70 text-xs mt-1">Track your claim progress</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {searchResult.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full backdrop-blur-md border ${
                          item.completed 
                            ? 'bg-green-500/30 border-green-400/50' 
                            : 'bg-white/10 border-white/20'
                        }`}>
                          {item.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-300" />
                          ) : (
                            <Clock className="h-4 w-4 text-white/50" />
                          )}
                        </div>
                        {index < searchResult.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${
                            item.completed ? 'bg-green-400/50' : 'bg-white/20'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={`font-medium ${
                          item.completed ? 'text-white' : 'text-white/50'
                        }`}>
                          {item.status}
                        </p>
                        <p className="text-xs text-white/60 mt-1">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-white">Your Information</h2>
                <p className="text-white/70 text-xs mt-1">Details associated with this claim</p>
              </div>
              
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
                    <User className="h-5 w-5 text-white/70" />
                    <div>
                      <p className="text-xs text-white/70">Wallet Address</p>
                      <p className="text-white font-mono text-xs">{searchResult.customer_wallet}</p>
                    </div>
                  </div>

                  {searchResult.customer_email && (
                    <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
                      <Mail className="h-5 w-5 text-white/70" />
                      <div>
                        <p className="text-xs text-white/70">Email</p>
                        <p className="text-white text-sm">{searchResult.customer_email}</p>
                      </div>
                    </div>
                  )}

                  {searchResult.customer_phone && (
                    <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
                      <Phone className="h-5 w-5 text-white/70" />
                      <div>
                        <p className="text-xs text-white/70">Phone</p>
                        <p className="text-white text-sm">{searchResult.customer_phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
                    <FileText className="h-5 w-5 text-white/70" />
                    <div>
                      <p className="text-xs text-white/70">Claim ID</p>
                      <p className="text-white font-medium">{searchResult.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-blue-300 mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
                  <p className="text-white/80 text-sm mb-4">
                    If you have any questions about your claim or need assistance, please contact our support team.
                  </p>
                  <Button className="backdrop-blur-md bg-white/30 hover:bg-white/40 text-white border-white/30">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchResult && !isSearching && (
          <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-12 shadow-2xl text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white/70" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Claims Found</h3>
              <p className="text-white/70 text-sm">
                Enter your wallet address above to search for your claim status
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsumerDash
