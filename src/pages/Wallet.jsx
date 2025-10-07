import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { getWallet, redeemPoints, transferPoints } from "../api/wallet";

export default function Wallet() {
  const [wallet, setWallet] = useState({ balance: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [transferUser, setTransferUser] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [loadingRedeem, setLoadingRedeem] = useState(false);
  const [loadingTransfer, setLoadingTransfer] = useState(false);

  const typeLabels = {
    earn: "Earned",
    redeem: "Redeemed",
    transfer_in: "Received",
    transfer_out: "Sent",
    admin_add: "Admin added",
    admin_deduct: "Admin deducted",
  };

  // Fetch wallet data
  const fetchWallet = async () => {
    setLoading(true);
    try {
      const data = await getWallet(); // expects { balance, history }
      setWallet(data);
    } catch (err) {
      console.error("Fetch wallet error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // Redeem points
  const redeem = async () => {
    const amt = Number(redeemAmount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");

    setLoadingRedeem(true);
    try {
      await redeemPoints(amt);
      toast.success(`Redeemed ${amt} points`);
      setRedeemAmount("");
      fetchWallet();
    } catch (err) {
      toast.error(err.response?.data?.message || "Redeem failed");
    } finally {
      setLoadingRedeem(false);
    }
  };

  // Transfer points
  const transfer = async () => {
    const amt = Number(transferAmount);
    if (!transferUser) return toast.error("Enter recipient username");
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");

    setLoadingTransfer(true);
    try {
      await transferPoints(transferUser, amt);
      toast.success(`Transferred ${amt} points to ${transferUser}`);
      setTransferUser("");
      setTransferAmount("");
      fetchWallet();
    } catch (err) {
      toast.error(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoadingTransfer(false);
    }
  };

  if (loading) return <div className="text-center mt-6">Loading wallet...</div>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto mt-6">
      <Toaster position="top-right" />
      <h2 className="text-xl font-bold mb-4">Wallet</h2>

      <div className="mb-4">
        <strong>Balance:</strong> {wallet.balance} points
      </div>

      <div className="mb-4">
        <strong>Transactions:</strong>
        <ul className="mt-2 text-sm max-h-40 overflow-y-auto">
          {wallet.history?.slice().reverse().map((t) => (
            <li
              key={t._id}
              className="p-2 rounded mb-1 bg-gray-50 border-l-4 border-gray-300"
            >
              {typeLabels[t.type] || t.type} — {t.amount} —{" "}
              {t.fromUser
                ? `from ${t.fromUser.username}`
                : t.toUser
                ? `to ${t.toUser.username}`
                : ""}{" "}
              — {new Date(t.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Redeem */}
      <div className="mb-4 flex gap-2">
        <input
          type="number"
          value={redeemAmount}
          onChange={(e) => setRedeemAmount(e.target.value)}
          className="p-2 border flex-1"
          placeholder="Amount to redeem"
          disabled={loadingRedeem}
        />
        <button
          onClick={redeem}
          className={`px-3 py-2 rounded text-white ${
            loadingRedeem ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
          }`}
          disabled={loadingRedeem}
        >
          {loadingRedeem ? "Redeeming..." : "Redeem"}
        </button>
      </div>

      {/* Transfer */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={transferUser}
          onChange={(e) => setTransferUser(e.target.value)}
          className="p-2 border"
          placeholder="Recipient username"
          disabled={loadingTransfer}
        />
        <input
          type="number"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          className="p-2 border"
          placeholder="Amount to transfer"
          disabled={loadingTransfer}
        />
        <button
          onClick={transfer}
          className={`px-3 py-2 rounded text-white ${
            loadingTransfer ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
          }`}
          disabled={loadingTransfer}
        >
          {loadingTransfer ? "Transferring..." : "Transfer"}
        </button>
      </div>
    </div>
  );
}