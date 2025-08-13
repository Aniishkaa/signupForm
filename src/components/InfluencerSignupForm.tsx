import { component$, useSignal, $ } from '@builder.io/qwik';
import { z } from 'zod';

const countries = [
  "United Kingdom",
  "United States", 
  "France",
  "Germany",
  "Italy",
  "Spain",
  "India",
  "United Arab Emirates",
  "Netherlands"
];

const trafficRanges = [
  "Under 1,000",
  "1,000 – 5,000", 
  "5,000 – 10,000",
  "10,000 – 50,000",
  "50,000 – 100,000",
  "100,000 – 500,000",
  "500,000 – 1,000,000+"
];

const followerRanges = [
  "10,000-25,000",
  "25,000-50,000",
  "50,000-80,000",
  "80,000-100,000",
  "100,000-500,000",
  "500,000+"
];

const products = [
  "Blankets",
  "Photobooks", 
  "Canvas",
  "Calendars",
  "Framed Prints",
  "Metal Prints"
];

const formSchema = z.object({
  instagramUsername: z.string()
    .min(1, "Instagram username is required")
    .regex(/^@?[a-zA-Z0-9._]+$/, "Please enter a valid Instagram username"),
  followerCount: z.string().min(1, "Please select your follower count range"),
  trafficRange: z.string().min(1, "Please select your traffic range"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  productsToPromote: z.string().min(1, "Please select a product"),
  countryOfResidence: z.string().min(1, "Please select your country of residence"),
  followersLocation: z.string().min(1, "Please select where most of your followers are based"),
});

type FormData = z.infer<typeof formSchema>;

export const InfluencerSignupForm = component$(() => {
  const isSubmitting = useSignal(false);
  const selectedProduct = useSignal<string>("");
  const formData = useSignal<Partial<FormData>>({
    productsToPromote: "",
  });
  const errors = useSignal<Partial<Record<keyof FormData, string>>>({});
  const showSuccessToast = useSignal(false);
  const showErrorToast = useSignal(false);
  const toastMessage = useSignal("");

  const handleProductSelect = $((product: string) => {
    selectedProduct.value = product;
    formData.value.productsToPromote = product;
  });

  const validateForm = $(() => {
    try {
      formSchema.parse(formData.value);
      errors.value = {};
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        errors.value = newErrors;
      }
      return false;
    }
  });

  const onSubmit = $(async () => {
    console.log("Form submission started", formData.value);
    
    if (!validateForm()) {
      return;
    }

    isSubmitting.value = true;
    
    try {
      // Format username to ensure it starts with @
      const formattedUsername = formData.value.instagramUsername?.startsWith('@') 
        ? formData.value.instagramUsername 
        : `@${formData.value.instagramUsername}`;

      const submissionData = {
        ...formData.value,
        instagramUsername: formattedUsername,
        timestamp: new Date().toISOString(),
      };

      // Submit to Supabase via edge function
      console.log("Submitting data:", submissionData);
      
      const response = await fetch(
        "https://rrbbkiaguqmcgwvibiqv.supabase.co/functions/v1/submit-influencer-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      const result = await response.json();
      console.log("Response result:", result);
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit form");
      }
      
      // Show success toast
      toastMessage.value = "Application Submitted! 🎉 Thanks for your interest! We'll review your application and get back to you soon.";
      showSuccessToast.value = true;

      // Reset form
      formData.value = { productsToPromote: "" };
      selectedProduct.value = "";
      
      // Hide toast after 5 seconds
      setTimeout(() => {
        showSuccessToast.value = false;
      }, 5000);
      
    } catch (error) {
      console.error("Submission error:", error);
      
      // Show error toast
      toastMessage.value = "Oops, something went wrong! Please try submitting again. If the problem persists, contact us directly.";
      showErrorToast.value = true;

      // Hide toast after 5 seconds
      setTimeout(() => {
        showErrorToast.value = false;
      }, 5000);
    } finally {
      isSubmitting.value = false;
    }
  });

  const updateField = $((field: keyof FormData, value: string) => {
    formData.value[field] = value;
    // Clear error when user starts typing
    if (errors.value[field]) {
      delete errors.value[field];
    }
  });

  return (
    <div class="min-h-screen bg-gradient-subtle p-4">
      <div class="max-w-md mx-auto pt-8 pb-12">
        {/* Header */}
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-instagram rounded-full flex items-center justify-center mx-auto mb-4 shadow-hover-lift">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-foreground mb-2">
            Hey influencer! 👋
          </h1>
          <p class="text-muted-foreground text-base">
            We'd love to learn more about you 👇
          </p>
        </div>

        {/* Introductory Paragraph */}
        <div class="text-center mb-6 p-4 bg-card rounded-lg border shadow-soft">
          <p class="text-foreground leading-relaxed">
            Thank you for your interest in collaborating with Printerpix!<br />
            We love working with creative influencers and are excited to explore a barter collaboration with you.<br />
            You can switch to your local region or preferred language using the section below this form.
          </p>
        </div>

        {/* Form */}
        <div class="bg-gradient-card border-0 shadow-soft rounded-lg">
          <div class="p-6 pb-4">
            <div class="text-center">
              <h2 class="text-lg font-semibold">Let's Collaborate!</h2>
            </div>
          </div>
          <div class="px-6 pb-6 space-y-6">
            <div class="space-y-6">
              {/* Instagram Username */}
              <div class="space-y-2">
                <label class="flex items-center gap-2 font-medium">
                  <svg class="w-4 h-4 text-instagram-purple" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram Username
                </label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={formData.value.instagramUsername || ""}
                  onInput$={(ev) => updateField("instagramUsername", (ev.target as HTMLInputElement).value)}
                  class="h-12 text-base w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.value.instagramUsername && (
                  <p class="text-sm text-destructive">{errors.value.instagramUsername}</p>
                )}
              </div>

              {/* Follower Count */}
              <div class="space-y-2">
                <label class="flex items-center gap-2 font-medium">
                  <svg class="w-4 h-4 text-instagram-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  Follower Count
                </label>
                <select
                  value={formData.value.followerCount || ""}
                  onChange$={(ev) => updateField("followerCount", (ev.target as HTMLSelectElement).value)}
                  class="h-12 text-base w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select your follower count range</option>
                  {followerRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                {errors.value.followerCount && (
                  <p class="text-sm text-destructive">{errors.value.followerCount}</p>
                )}
              </div>

              {/* Traffic Range */}
              <div class="space-y-2">
                <label class="flex items-center gap-2 font-medium">
                  <svg class="w-4 h-4 text-instagram-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  Traffic on Profile
                </label>
                <select
                  value={formData.value.trafficRange || ""}
                  onChange$={(ev) => updateField("trafficRange", (ev.target as HTMLSelectElement).value)}
                  class="h-12 text-base w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select your traffic range</option>
                  {trafficRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                {errors.value.trafficRange && (
                  <p class="text-sm text-destructive">{errors.value.trafficRange}</p>
                )}
              </div>

              {/* Email */}
              <div class="space-y-2">
                <label class="flex items-center gap-2 font-medium">
                  <svg class="w-4 h-4 text-instagram-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.value.email || ""}
                  onInput$={(ev) => updateField("email", (ev.target as HTMLInputElement).value)}
                  class="h-12 text-base w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.value.email && (
                  <p class="text-sm text-destructive">{errors.value.email}</p>
                )}
              </div>

              {/* Country of Residence */}
              <div class="space-y-2">
                <label class="flex items-center gap-2 font-medium">
                  <svg class="w-4 h-4 text-instagram-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Country of Residence
                </label>
                <select
                  value={formData.value.countryOfResidence || ""}
                  onChange$={(ev) => updateField("countryOfResidence", (ev.target as HTMLSelectElement).value)}
                  class="h-12 text-base w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.value.countryOfResidence && (
                  <p class="text-sm text-destructive">{errors.value.countryOfResidence}</p>
                )}
              </div>

              {/* Followers Location */}
              <div class="space-y-2">
                <label class="flex items-center gap-2 font-medium">
                  <svg class="w-4 h-4 text-instagram-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Where are most of your followers based?
                </label>
                <select
                  value={formData.value.followersLocation || ""}
                  onChange$={(ev) => updateField("followersLocation", (ev.target as HTMLSelectElement).value)}
                  class="h-12 text-base w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select followers location</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.value.followersLocation && (
                  <p class="text-sm text-destructive">{errors.value.followersLocation}</p>
                )}
              </div>

              {/* Products to Promote */}
              <div class="space-y-2">
                <label class="flex items-center gap-2 font-medium">
                  <svg class="w-4 h-4 text-instagram-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  Which product would you like to promote?
                </label>
                <div class="grid grid-cols-2 gap-3">
                  {products.map((product) => (
                    <button
                      key={product}
                      type="button"
                      onClick$={() => handleProductSelect(product)}
                      class={`p-3 text-sm font-medium rounded-lg border transition-all ${
                        selectedProduct.value === product
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {product}
                    </button>
                  ))}
                </div>
                {errors.value.productsToPromote && (
                  <p class="text-sm text-destructive">{errors.value.productsToPromote}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick$={onSubmit}
                disabled={isSubmitting.value}
                class="w-full h-12 bg-gradient-instagram text-white font-medium rounded-lg shadow-soft hover:shadow-hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting.value ? (
                  <div class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Regional Sites Section */}
        <div class="mt-8 p-6 bg-card rounded-lg border shadow-soft">
          <h3 class="text-sm font-medium text-center mb-3 text-muted-foreground">
            Country of residence? Click below to visit your regional site:
          </h3>
          <div class="flex items-center justify-center gap-4 flex-nowrap">
            <a
              href="https://www.printerpix.com"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 hover:scale-105 transition-transform flex-shrink-0"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-md border border-white">
                <img src="https://www.printerpix.com/wp-content/uploads/2023/07/us-flag.png" alt="United States" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-medium text-foreground">US</span>
            </a>
            <a
              href="https://www.printerpix.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 hover:scale-105 transition-transform flex-shrink-0"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-md border border-white">
                <img src="https://www.printerpix.co.uk/wp-content/uploads/2023/07/gb-flag.png" alt="United Kingdom" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-medium text-foreground">UK</span>
            </a>
            <a
              href="https://www.printerpix.fr"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 hover:scale-105 transition-transform flex-shrink-0"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-md border border-white">
                <img src="https://www.printerpix.fr/wp-content/uploads/2023/07/fr-flag.png" alt="France" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-medium text-foreground">FR</span>
            </a>
            <a
              href="https://www.printerpix.it"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 hover:scale-105 transition-transform flex-shrink-0"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-md border border-white">
                <img src="https://www.printerpix.it/wp-content/uploads/2023/07/it-flag.png" alt="Italy" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-medium text-foreground">IT</span>
            </a>
            <a
              href="https://www.printerpix.es"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 hover:scale-105 transition-transform flex-shrink-0"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-md border border-white">
                <img src="https://www.printerpix.es/wp-content/uploads/2023/07/es-flag.png" alt="Spain" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-medium text-foreground">ES</span>
            </a>
            <a
              href="https://www.printerpix.de"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 hover:scale-105 transition-transform flex-shrink-0"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-md border border-white">
                <img src="https://www.printerpix.de/wp-content/uploads/2023/07/de-flag.png" alt="Germany" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-medium text-foreground">DE</span>
            </a>
            <a
              href="https://www.printerpix.nl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 hover:scale-105 transition-transform flex-shrink-0"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-md border border-white">
                <img src="https://www.printerpix.nl/wp-content/uploads/2023/07/nl-flag.png" alt="Netherlands" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-medium text-foreground">NL</span>
            </a>
            <a
              href="https://www.printerpix.in"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 hover:scale-105 transition-transform flex-shrink-0"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-md border border-white">
                <img src="https://www.printerpix.in/wp-content/uploads/2023/07/in-flag.png" alt="India" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-medium text-foreground">IN</span>
            </a>
          </div>
        </div>

        {/* Toast Notifications */}
        {showSuccessToast.value && (
          <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm">
            <p>{toastMessage.value}</p>
          </div>
        )}

        {showErrorToast.value && (
          <div class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm">
            <p>{toastMessage.value}</p>
          </div>
        )}
      </div>
    </div>
  );
});