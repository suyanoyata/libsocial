export const Conditional = ({
  conditions,
  children,
}: {
  conditions: boolean[];
  children: React.ReactNode;
}) => {
  if (!conditions.includes(false)) {
    return children;
  }
};
