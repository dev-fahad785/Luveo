import { FaTruck, FaBoxOpen, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: FaTruck,
    title: "Fast, Free Shipping",
    description: "All over Pakistan",
  },
  {
    icon: FaBoxOpen,
    title: "Open Parcel Delivery",
    description: "Free – No Question Ask",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Payment",
    description: "100% Safe Checkout",
  },
];

const InfoBanner = () => {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--prada-border)]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 py-6 md:py-8 md:px-8 first:md:pl-0 last:md:pr-0"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[var(--prada-black)]">
                  <Icon className="text-lg" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-[0.03em] text-[var(--prada-black)]">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-[var(--prada-mid-gray)] mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
