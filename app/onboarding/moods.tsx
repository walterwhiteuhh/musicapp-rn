import { Redirect } from 'expo-router';

export default function MoodsRoute() {
  return <Redirect href={'/onboarding/dimensions' as never} />;
}
