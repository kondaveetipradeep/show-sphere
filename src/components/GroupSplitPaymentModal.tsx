import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  UserPlus, 
  Trash2, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { SplitGroup, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface GroupSplitPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  currency: Currency;
  bookingTitle: string;
  onConfirmSplit: (splitGroup: SplitGroup) => void;
}

export const GroupSplitPaymentModal: React.FC<GroupSplitPaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  currency,
  bookingTitle,
  onConfirmSplit,
}) => {
  const [members, setMembers] = useState<string[]>([
    'You (Host)',
    'Aarav Sharma',
    'Priya Patel',
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<SplitGroup | null>(null);

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    setMembers([...members, newMemberName.trim()]);
    setNewMemberName('');
  };

  const handleRemoveMember = (idx: number) => {
    if (idx === 0) return; // Cannot remove host
    setMembers(members.filter((_, i) => i !== idx));
  };

  const perPersonAmount = totalAmount / members.length;

  const handleCreateSplitSession = async () => {
    try {
      const res = await fetch('/api/split-group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: `bk_${Date.now()}`,
          totalAmount,
          currency,
          hostName: 'You (Host)',
          memberNames: members,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedGroup(data.splitGroup);
        setIsCreated(true);
      }
    } catch (err) {
      console.error('Failed to create split group', err);
      // Fallback
      const fallbackGroup: SplitGroup = {
        id: `split_${Date.now()}`,
        bookingId: `bk_${Date.now()}`,
        totalAmount,
        currency,
        hostName: 'You (Host)',
        members: members.map((m, idx) => ({
          id: `mem_${idx + 1}`,
          name: m,
          phoneOrEmail: `${m.toLowerCase().replace(/\s+/g, '')}@showsphere.io`,
          amount: Number(perPersonAmount.toFixed(2)),
          status: idx === 0 ? 'paid' : 'pending',
          isHost: idx === 0,
        })),
        expiresAt: Date.now() + 86400000,
        shareableCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        isFullySettled: false,
      };
      setCreatedGroup(fallbackGroup);
      setIsCreated(true);
    }
  };

  const handleSimulateFriendPayment = async (memberId: string) => {
    if (!createdGroup) return;
    try {
      const res = await fetch(`/api/split-group/${createdGroup.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, paymentMethod: 'Stripe Instant' }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedGroup(data.splitGroup);
      }
    } catch (err) {
      setCreatedGroup((prev) => {
        if (!prev) return null;
        const updated = { ...prev };
        const mem = updated.members.find((m) => m.id === memberId);
        if (mem) {
          mem.status = 'paid';
          mem.paidAt = new Date().toISOString();
        }
        updated.isFullySettled = updated.members.every((m) => m.status === 'paid');
        return updated;
      });
    }
  };

  const copyShareLink = () => {
    const link = `https://showsphere.io/split/${createdGroup?.shareableCode || 'SPLIT-PASS'}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Split Payment with Friends</h3>
              <p className="text-[11px] text-slate-500">Divide booking costs equally</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Bill Overview */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-500 font-medium">Total Amount:</div>
              <div className="text-xs text-slate-800 font-bold line-clamp-1">{bookingTitle}</div>
            </div>
            <div className="text-right">
              <div className="font-extrabold font-mono text-lg text-rose-600">
                {formatPrice(totalAmount, currency)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {formatPrice(perPersonAmount, currency)} / person
              </div>
            </div>
          </div>

          {!isCreated ? (
            /* Setup Step */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Group Members ({members.length})</span>
                <span className="text-[11px] text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Equal Split
                </span>
              </div>

              {/* Members List */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {members.map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-slate-800">{name}</span>
                      {idx === 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">
                          HOST
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-emerald-700 font-bold">
                        {formatPrice(perPersonAmount, currency)}
                      </span>
                      {idx > 0 && (
                        <button
                          onClick={() => handleRemoveMember(idx)}
                          className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Member Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Friend's Name..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                />
                <button
                  onClick={handleAddMember}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCreateSplitSession}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Generate Split Link & Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Live Split Tracker Step */
            <div className="space-y-3 animate-in fade-in">
              {/* Shareable Link Box */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-900 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Share with Group:
                  </span>
                  <span className="font-mono font-bold text-purple-800 bg-white px-2 py-0.5 rounded border border-purple-200">
                    Code: {createdGroup?.shareableCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`https://showsphere.io/split/${createdGroup?.shareableCode}`}
                    className="flex-1 bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-mono"
                  />
                  <button
                    onClick={copyShareLink}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Live Member Status */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500">Payment Status:</div>
                {createdGroup?.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {member.status === 'paid' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                      )}
                      <div>
                        <div className="font-bold text-slate-800">{member.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {member.status === 'paid' ? 'Paid' : 'Pending'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-slate-800">
                        {formatPrice(member.amount, currency)}
                      </span>
                      {member.status !== 'paid' && (
                        <button
                          onClick={() => handleSimulateFriendPayment(member.id)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-[10px] font-semibold transition cursor-pointer"
                          title="Simulate friend clicking the Stripe payment link"
                        >
                          Simulate Pay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Complete Action */}
              <button
                onClick={() => {
                  if (createdGroup) {
                    onConfirmSplit(createdGroup);
                    onClose();
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Split & Proceed</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
