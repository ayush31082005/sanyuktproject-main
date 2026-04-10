import { useEffect, useState } from 'react';
import { CreditCard, MapPin, PackagePlus, Receipt, ShoppingBag, UserRound } from 'lucide-react';
import api from '../../api';

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

const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export default function PlaceOrderPage() {
    const storedUser = getStoredUser();
    const [productsList, setProductsList] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [directSellerId, setDirectSellerId] = useState('');
    const [name] = useState(storedUser?.memberId || storedUser?.userName || '');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);
    const [payFrom, setPayFrom] = useState('');
    const [orderTo, setOrderTo] = useState('');
    const [shippingAddress, setShippingAddress] = useState(storedUser?.shippingAddress || '');
    const [accountPassword, setAccountPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProductsList(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching products:', error);
                setFeedback({ type: 'error', message: 'Products load nahi ho pa rahe.' });
            } finally {
                setProductsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addProduct = () => {
        if (!selectedProduct) return;

        const product = productsList.find((item) => item._id === selectedProduct);
        if (!product) return;

        const qty = Math.max(1, Number(quantity || 1));
        const existingIndex = cart.findIndex((item) => item._id === product._id);

        if (existingIndex !== -1) {
            const updated = [...cart];
            updated[existingIndex].quantity += qty;
            setCart(updated);
        } else {
            setCart((prev) => [
                ...prev,
                {
                    _id: product._id,
                    name: product.name,
                    price: Number(product.price || 0),
                    bv: Number(product.bv || 0),
                    quantity: qty,
                },
            ]);
        }

        setSelectedProduct('');
        setQuantity(1);
        setFeedback({ type: '', message: '' });
    };

    const totalDP = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPV = cart.reduce((sum, item) => sum + item.bv * item.quantity, 0);
    const productValue = totalDP;
    const eWalletValue = 0;
    const netPayable = totalDP;

    const handleOrder = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedback({ type: '', message: '' });

        try {
            const { data } = await api.post('/orders/first-purchase', {
                directSellerId,
                cart,
                payFrom,
                orderTo,
                shippingAddress,
                accountPassword,
            });

            setCart([]);
            setPayFrom('');
            setOrderTo('');
            setAccountPassword('');
            setDirectSellerId('');
            setFeedback({
                type: 'success',
                message: data?.message || 'First purchase order place ho gaya.',
            });
        } catch (error) {
            console.error('First purchase order error:', error);
            setFeedback({
                type: 'error',
                message: error?.response?.data?.message || error?.message || 'Order place nahi ho paaya.',
            });
        } finally {
            setSubmitting(false);
        }
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
                            <input type="text" value={name} readOnly className={`${fieldClass} bg-[#151515] text-white`} />
                        </div>

                        <div>
                            <label className={fieldLabelClass}>Product</label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className={fieldClass}
                                disabled={productsLoading}
                            >
                                <option value="">{productsLoading ? 'Loading products...' : '--Select Products--'}</option>
                                {productsList.map((product) => (
                                    <option key={product._id} value={product._id}>
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
                            disabled={productsLoading}
                            className="rounded-2xl bg-[#C8A96A] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d] disabled:cursor-not-allowed disabled:opacity-50"
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
                                            <tr key={item._id} className="border-b border-white/5 last:border-b-0">
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
                                <select value={payFrom} onChange={(e) => setPayFrom(e.target.value)} className={fieldClass}>
                                    <option value="">Select Wallet</option>
                                    <option value="product-wallet">Product Wallet</option>
                                    <option value="e-wallet">E-Wallet</option>
                                </select>
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Order To</label>
                                <select value={orderTo} onChange={(e) => setOrderTo(e.target.value)} className={fieldClass}>
                                    <option value="">Select</option>
                                    <option value="admin">Admin</option>
                                    <option value="franchise">Franchise</option>
                                    <option value="self">Self</option>
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

                        {feedback.message && (
                            <div className={`rounded-2xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/20 bg-rose-500/10 text-rose-300'}`}>
                                {feedback.message}
                            </div>
                        )}

                        <div className="flex justify-start pt-2">
                            <button
                                type="submit"
                                disabled={submitting || cart.length === 0}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#C8A96A] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <CreditCard size={16} />
                                {submitting ? 'Placing...' : 'Order Now'}
                            </button>
                        </div>
                    </form>
                </SectionCard>
            </div>
        </div>
    );
}
