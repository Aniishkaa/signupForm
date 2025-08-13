import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const loc = useLocation();

  return (
    <>
      <title>Printerpix Influencer Signup</title>
      <meta name="description" content="Join Printerpix as an influencer and start collaborating with us!" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      
      <meta property="og:title" content="Printerpix Influencer Signup" />
      <meta property="og:description" content="Join Printerpix as an influencer and start collaborating with us!" />
      <meta property="og:url" content={loc.url.href} />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Printerpix Influencer Signup" />
      <meta name="twitter:description" content="Join Printerpix as an influencer and start collaborating with us!" />
    </>
  );
});