import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div class="min-h-screen flex items-center justify-center bg-background">
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold text-foreground">Welcome</h1>
        <p class="text-muted-foreground">Navigate to /influencer-signup to access the form</p>
      </div>
    </div>
  );
});