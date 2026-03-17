type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h4 className="mb-3 text-xl font-semibold">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}