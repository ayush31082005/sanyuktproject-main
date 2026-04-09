import { useState } from 'react';
import { BadgeIndianRupee, FileUp, Landmark, Receipt, WalletCards } from 'lucide-react';

const sectionTitleClass = 'text-[13px] font-black uppercase tracking-[0.14em] text-[#C8A96A]';
const fieldLabelClass = 'mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#F5E6C8]/70';
const fieldClass = 'w-full rounded-2xl border border-[#C8A96A]/15 bg-[#111111] px-4 py-3 text-sm text-[#F5E6C8] outline-none transition placeholder:text-[#F5E6C8]/30 focus:border-[#C8A96A]/50 focus:bg-[#141414]';

const SectionCard = ({ icon: Icon, title, children, rightSlot = null }) => (
    <div className="overflow-hidden rounded-[2rem] border border-[#C8A96A]/12 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-3 border-b border-white/5 bg-[linear-gradient(135deg,#1f1f1f_0%,#191919_50%,#151515_100%)] px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A]">
                    <Icon size={18} />
                </div>
                <div className={sectionTitleClass}>{title}</div>
            </div>
            {rightSlot}
        </div>
        <div className="p-5 md:p-6">{children}</div>
    </div>
);

export default function ProductWalletRequest() {
    const [formData, setFormData] = useState({
        bankName: '',
        bankDetails: '',
        paymentMode: 'UPI',
        currentBalance: '0.00',
        requestFund: '',
        remark: 'ISHA357528',
        password: '',
        attachment: null,
    });

    const [submittedData, setSubmittedData] = useState([]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'attachment') {
            setFormData((prev) => ({
                ...prev,
                attachment: files[0] || null,
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newRequest = {
            id: Date.now(),
            bankName: formData.bankName,
            bankDetails: formData.bankDetails,
            paymentMode: formData.paymentMode,
            currentBalance: formData.currentBalance,
            requestFund: formData.requestFund,
            remark: formData.remark,
            password: formData.password,
            attachmentName: formData.attachment ? formData.attachment.name : 'No File',
            status: 'Pending',
        };

        setSubmittedData((prev) => [newRequest, ...prev]);

        setFormData({
            bankName: '',
            bankDetails: '',
            paymentMode: 'UPI',
            currentBalance: '0.00',
            requestFund: '',
            remark: 'ISHA357528',
            password: '',
            attachment: null,
        });
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-4 py-6 md:px-6">
            <style>{`
                .wallet-request-theme input:-webkit-autofill,
                .wallet-request-theme textarea:-webkit-autofill,
                .wallet-request-theme select:-webkit-autofill {
                    -webkit-text-fill-color: #F5E6C8;
                    box-shadow: 0 0 0 1000px #111111 inset;
                    transition: background-color 9999s ease-in-out 0s;
                }
            `}</style>

            <div className="wallet-request-theme mx-auto max-w-[1280px] space-y-6">
                <SectionCard icon={WalletCards} title="Product Wallet Request">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={fieldLabelClass}>Bank Name</label>
                                <select
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    className={fieldClass}
                                >
                                    <option value="">--Select Bank--</option>
                                    <option value="SBI">SBI</option>
                                    <option value="HDFC">HDFC</option>
                                    <option value="ICICI">ICICI</option>
                                    <option value="PNB">PNB</option>
                                    <option value="Axis Bank">Axis Bank</option>
                                </select>
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Payment Mode</label>
                                <select
                                    name="paymentMode"
                                    value={formData.paymentMode}
                                    onChange={handleChange}
                                    className={fieldClass}
                                >
                                    <option value="IMPS">IMPS</option>
                                    <option value="UPI">UPI</option>
                                    <option value="NEFT">NEFT</option>
                                    <option value="RTGS">RTGS</option>
                                    <option value="DD">DD</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className={fieldLabelClass}>Bank Details</label>
                                <textarea
                                    name="bankDetails"
                                    value={formData.bankDetails}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Enter bank details"
                                    className={`${fieldClass} resize-none`}
                                />
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Current Balance</label>
                                <input
                                    type="text"
                                    name="currentBalance"
                                    value={formData.currentBalance}
                                    readOnly
                                    className={`${fieldClass} bg-[#151515] text-white`}
                                />
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Request Fund</label>
                                <div className="relative">
                                    <BadgeIndianRupee size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A96A]/60" />
                                    <input
                                        type="number"
                                        name="requestFund"
                                        value={formData.requestFund}
                                        onChange={handleChange}
                                        placeholder="Enter Amount"
                                        className={`${fieldClass} pl-11`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Remark / Reference No.</label>
                                <input
                                    type="text"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleChange}
                                    className={`${fieldClass} bg-[#151515] text-white`}
                                />
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Transaction / Account Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className={fieldClass}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={fieldLabelClass}>Attachment</label>
                                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[#C8A96A]/20 bg-[#111111] p-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-3 text-[#F5E6C8]/70">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A]">
                                            <FileUp size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-[#F5E6C8]">
                                                {formData.attachment ? formData.attachment.name : 'No file chosen'}
                                            </p>
                                            <p className="text-xs text-[#F5E6C8]/45">Upload receipt or bank proof</p>
                                        </div>
                                    </div>

                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#C8A96A] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d]">
                                        <Landmark size={16} />
                                        Choose File
                                        <input
                                            type="file"
                                            name="attachment"
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-start pt-2">
                            <button
                                type="submit"
                                className="rounded-2xl bg-[#C8A96A] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d]"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </SectionCard>

                <SectionCard
                    icon={Receipt}
                    title="Request Product Wallet History"
                    rightSlot={
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C8A96A]/15 bg-[#C8A96A]/8 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#F5E6C8]">
                            {submittedData.length} Records
                        </div>
                    }
                >
                    {submittedData.length === 0 ? (
                        <div className="flex min-h-[180px] items-center justify-center rounded-[1.5rem] border border-dashed border-[#C8A96A]/14 bg-[#121212] px-6 text-center">
                            <p className="text-sm text-[#F5E6C8]/50">No request history found.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-[1.5rem] border border-[#C8A96A]/12 bg-[#111111]">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[860px] border-collapse text-left text-sm text-[#F5E6C8]">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-[#171717] text-[11px] uppercase tracking-[0.12em] text-[#C8A96A]">
                                            <th className="px-4 py-3">Bank</th>
                                            <th className="px-4 py-3">Payment Mode</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Remark</th>
                                            <th className="px-4 py-3">Attachment</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submittedData.map((item) => (
                                            <tr key={item.id} className="border-b border-white/5 last:border-b-0">
                                                <td className="px-4 py-4">{item.bankName || '-'}</td>
                                                <td className="px-4 py-4">{item.paymentMode}</td>
                                                <td className="px-4 py-4">Rs {item.requestFund || '-'}</td>
                                                <td className="px-4 py-4">{item.remark || '-'}</td>
                                                <td className="px-4 py-4">{item.attachmentName}</td>
                                                <td className="px-4 py-4">
                                                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-300">
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </SectionCard>
            </div>
        </div>
    );
}
