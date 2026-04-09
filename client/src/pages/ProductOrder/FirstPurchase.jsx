import { useState } from 'react';
import { CreditCard, MapPin, PackagePlus, Receipt, ShoppingBag, UserRound } from 'lucide-react';

const productsList = [
    { id: 1, name: 'Paracetamol', price: 50, bv: 5 },
    { id: 2, name: 'Vitamin C', price: 120, bv: 12 },
    { id: 3, name: 'Protein Powder', price: 850, bv: 80 },
];

const sectionTitleClass = 'text-[13px] font-black uppercase tracking-[0.14em] text-[#C8A96A]';
const fieldLabelClass = 'mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#F5E6C8]/70';
const fieldClass = 'w-full rounded-2xl border border-[#C8A96A]/15 bg-[#111111] px-4 py-3 text-sm text-[#F5E6C8] outline-none transition placeholder:text-[#F5E6C8]/30 focus:border-[#C8A96A]/50 focus:bg-[#141414]';

const SectionCard = ({ icon: Icon, title, children }) => (
    <div className="overflow-hidden rounded-[2rem] border border-[#C8A96A]/12 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3 border-b border-white/5 bg-[linear-gradient(135deg,#1f1f1f_0%,#191919_50%,#151515_100%)] px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A]">
                <Icon size={18} />
            </div>
            <div className={sectionTitleClass}>{title}</div>
        </div>
        <div className="p-5 md:p-6">{children}</div>
    </div>
);

export default function PlaceOrderPage() {
    const [directSellerId, setDirectSellerId] = useState('');
    const [name, setName] = useState('ISHA557528');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);

    const [payFrom, setPayFrom] = useState('');
    const [orderTo, setOrderTo] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [accountPassword, setAccountPassword] = useState('');

    const addProduct = () => {
        if (!selectedProduct) return;

        const product = productsList.find((p) => p.id === Number(selectedProduct));
        if (!product) return;

        const existingIndex = cart.findIndex((item) => item.id === product.id);

        if (existingIndex !== -1) {
            const updated = [...cart];
            updated[existingIndex].quantity += Number(quantity);
            setCart(updated);
        } else {
            setCart([
                ...cart,
                {
                    ...product,
                    quantity: Number(quantity),
                },
            ]);
        }

        setSelectedProduct('');
        setQuantity(1);
    };

    const totalDP = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPV = cart.reduce((sum, item) => sum + item.bv * item.quantity, 0);
    const productValue = totalDP;
    const eWalletValue = 0;
    const netPayable = totalDP;

    const handleOrder = (e) => {
        e.preventDefault();

        const orderData = {
            directSellerId,
            name,
            cart,
            billing: {
                dp: totalDP,
                pv: totalPV,
                productValue,
                eWalletValue,
                netPayable,
            },
            payFrom,
            orderTo,
            shippingAddress,
            accountPassword,
        };

        console.log('Order Data:', orderData);
        alert('Order placed successfully');
    };

    const billingStats = [
        { label: 'DP', value: totalDP },
        { label: 'PV', value: totalPV },
        { label: 'Product Value', value: `Rs ${productValue}` },
        { label: 'E-Wallet', value: `Rs ${eWalletValue}` },
        { label: 'Net Payable', value: `Rs ${netPayable}` },
    ];

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-4 py-6 md:px-6">
            <style>{`
                .order-theme input:-webkit-autofill,
                .order-theme textarea:-webkit-autofill,
                .order-theme select:-webkit-autofill {
                    -webkit-text-fill-color: #F5E6C8;
                    box-shadow: 0 0 0 1000px #111111 inset;
                    transition: background-color 9999s ease-in-out 0s;
                }
            `}</style>

            <div className="order-theme mx-auto max-w-[1280px] space-y-6">
                <SectionCard icon={PackagePlus} title="Add Products">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className={fieldLabelClass}>Direct Seller ID</label>
                            <input
                                type="text"
                                value={directSellerId}
                                onChange={(e) => setDirectSellerId(e.target.value)}
                                placeholder="Enter Direct Seller ID"
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label className={fieldLabelClass}>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`${fieldClass} bg-[#151515] text-white`}
                            />
                        </div>

                        <div>
                            <label className={fieldLabelClass}>Product</label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className={fieldClass}
                            >
                                <option value="">--Select Products--</option>
                                {productsList.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - Rs {product.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={fieldLabelClass}>Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className={fieldClass}
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex justify-start">
                        <button
                            type="button"
                            onClick={addProduct}
                            className="rounded-2xl bg-[#C8A96A] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d]"
                        >
                            Add Product
                        </button>
                    </div>
                </SectionCard>

                <SectionCard icon={Receipt} title="Billing Details">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                        {billingStats.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-2xl border border-[#C8A96A]/12 bg-[#121212] px-4 py-4 text-center"
                            >
                                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#C8A96A]">
                                    {item.label}
                                </p>
                                <p className="mt-2 text-[1.3rem] font-black tracking-tight text-[#F5E6C8]">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {cart.length > 0 && (
                        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#C8A96A]/12 bg-[#111111]">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[620px] border-collapse text-left text-sm text-[#F5E6C8]">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-[#171717] text-[11px] uppercase tracking-[0.12em] text-[#C8A96A]">
                                            <th className="px-4 py-3">Product</th>
                                            <th className="px-4 py-3">Price</th>
                                            <th className="px-4 py-3">BV</th>
                                            <th className="px-4 py-3">Qty</th>
                                            <th className="px-4 py-3">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((item) => (
                                            <tr key={item.id} className="border-b border-white/5 last:border-b-0">
                                                <td className="px-4 py-3">{item.name}</td>
                                                <td className="px-4 py-3">Rs {item.price}</td>
                                                <td className="px-4 py-3">{item.bv}</td>
                                                <td className="px-4 py-3">{item.quantity}</td>
                                                <td className="px-4 py-3">Rs {item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </SectionCard>

                <SectionCard icon={ShoppingBag} title="Place Order">
                    <form onSubmit={handleOrder} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={fieldLabelClass}>Pay From</label>
                                <select
                                    value={payFrom}
                                    onChange={(e) => setPayFrom(e.target.value)}
                                    className={fieldClass}
                                >
                                    <option value="">Select Wallet</option>
                                    <option value="product-wallet">Product Wallet</option>
                                    <option value="e-wallet">E-Wallet</option>
                                </select>
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Order To</label>
                                <select
                                    value={orderTo}
                                    onChange={(e) => setOrderTo(e.target.value)}
                                    className={fieldClass}
                                >
                                    <option value="">Select</option>
                                    <option value="self">Self</option>
                                    <option value="customer">Customer</option>
                                    <option value="direct-seller">Direct Seller</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={fieldLabelClass}>Shipping Address</label>
                            <div className="relative">
                                <MapPin size={16} className="pointer-events-none absolute left-4 top-4 text-[#C8A96A]/60" />
                                <textarea
                                    rows="4"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter Shipping Address"
                                    className={`${fieldClass} resize-none pl-11`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={fieldLabelClass}>Account Password</label>
                            <div className="relative">
                                <UserRound size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A96A]/60" />
                                <input
                                    type="password"
                                    value={accountPassword}
                                    onChange={(e) => setAccountPassword(e.target.value)}
                                    className={`${fieldClass} pl-11`}
                                />
                            </div>
                        </div>

                        <div className="flex justify-start pt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#C8A96A] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d]"
                            >
                                <CreditCard size={16} />
                                Order Now
                            </button>
                        </div>
                    </form>
                </SectionCard>
            </div>
        </div>
    );
}
