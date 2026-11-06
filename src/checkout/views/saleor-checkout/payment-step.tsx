"use client";

import { useState, useEffect, useCallback, useRef, type FC } from "react";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/ui/components/ui/button";
import { CheckoutSummaryContext, buildPaymentSummaryRows } from "./checkout-summary-context";
import {
	type CheckoutFragment,
	type CountryCode,
	type AddressFragment,
	useCheckoutBillingAddressUpdateMutation,
	useCheckoutCompleteMutation,
} from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/use-checkout";
import { useUser } from "@/checkout/hooks/use-user";
import { getAddressInputData } from "@/checkout/components/address-form/utils";
import { createQueryString } from "@/checkout/lib/utils/url";
import { localeConfig } from "@/config/locale";
import { MobileStickyAction } from "./mobile-sticky-action";
import { getStepNumber } from "./flow";

// Extracted reusable components
import { BillingAddressSection, type BillingAddressData } from "@/checkout/components/payment";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { formatMoneyWithFallback } from "@/checkout/lib/utils/money";

interface PaymentStepProps {
	checkout: CheckoutFragment;
	onBack: () => void;
	onComplete: () => void;
	onGoToInformation?: () => void;
}

export const PaymentStep: FC<PaymentStepProps> = ({
	checkout: initialCheckout,
	onBack,
	onGoToInformation,
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	// Use live checkout data to ensure we have the latest total (including shipping)
	const { checkout: liveCheckout } = useCheckout();
	const checkout = liveCheckout || initialCheckout;

	// Get user data for saved addresses
	const { user, authenticated } = useUser();

	// For digital products, there's no shipping address, so can't use "same as billing"
	const isShippingRequired = checkout.isShippingRequired;
	const hasShippingAddress = !!checkout.shippingAddress;

	// Billing address state
	const [sameAsBilling, setSameAsBilling] = useState(isShippingRequired && hasShippingAddress);
	// Lazy initialization - complex object only created once on mount
	const [billingData, setBillingData] = useState<BillingAddressData>(() => ({
		countryCode: (checkout.billingAddress?.country?.code as CountryCode) || "US",
		formData: {
			firstName: checkout.billingAddress?.firstName || "",
			lastName: checkout.billingAddress?.lastName || "",
			streetAddress1: checkout.billingAddress?.streetAddress1 || "",
			streetAddress2: checkout.billingAddress?.streetAddress2 || "",
			companyName: checkout.billingAddress?.companyName || "",
			city: checkout.billingAddress?.city || "",
			postalCode: checkout.billingAddress?.postalCode || "",
			countryArea: checkout.billingAddress?.countryArea || "",
			phone: checkout.billingAddress?.phone || "",
		},
	}));

	// Sync billing address from server state
	useEffect(() => {
		const billing = checkout.billingAddress;
		if (billing) {
			setBillingData((prev) => ({
				...prev,
				countryCode: (billing.country?.code as CountryCode) || "US",
				formData: {
					firstName: billing.firstName || "",
					lastName: billing.lastName || "",
					streetAddress1: billing.streetAddress1 || "",
					streetAddress2: billing.streetAddress2 || "",
					companyName: billing.companyName || "",
					city: billing.city || "",
					postalCode: billing.postalCode || "",
					countryArea: billing.countryArea || "",
					cityArea: billing.cityArea || "",
					phone: billing.phone || "",
				},
			}));
		}
	}, [checkout.billingAddress]);

	const [isProcessing, setIsProcessing] = useState(false);
	const submitting = useRef(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Mutations
	const [, updateBillingAddress] = useCheckoutBillingAddressUpdateMutation();
	const [completeState, checkoutComplete] = useCheckoutCompleteMutation();

	const shippingAddress = checkout.shippingAddress;

	// Memoize billing data handler to avoid infinite loops
	const handleBillingDataChange = useCallback((data: BillingAddressData) => {
		setBillingData(data);
	}, []);

	// Summary rows for context display
	const summaryRows = buildPaymentSummaryRows(checkout);

	// Handle step navigation from summary
	const handleGoToStep = (step: number) => {
		if (step === 1 && onGoToInformation) {
			onGoToInformation();
		} else if (step === 2) {
			onBack();
		}
	};

	const total = checkout.totalPrice?.gross;
	const totalStr = formatMoneyWithFallback(total);

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			if (event) {
				event.preventDefault();
			}
			if (submitting.current) return;
			submitting.current = true;

			setErrors({});

			// Validate billing address if different from shipping (or for digital products)
			const needsBillingForm = !sameAsBilling || !hasShippingAddress;

			setIsProcessing(true);
			try {
				// Update billing address
				if (needsBillingForm) {
					let addressInput;

					// Check if user selected a saved address
					if (billingData.selectedAddressId && user?.addresses) {
						const selectedAddress = user.addresses.find((addr) => addr.id === billingData.selectedAddressId);
						if (selectedAddress) {
							addressInput = getAddressInputData({
								firstName: selectedAddress.firstName || "",
								lastName: selectedAddress.lastName || "",
								streetAddress1: selectedAddress.streetAddress1 || "",
								streetAddress2: selectedAddress.streetAddress2 || "",
								companyName: selectedAddress.companyName || "",
								city: selectedAddress.city || "",
								postalCode: selectedAddress.postalCode || "",
								countryArea: selectedAddress.countryArea || "",
								phone: selectedAddress.phone || "",
								countryCode: selectedAddress.country?.code as CountryCode,
							});
						}
					}

					// If no saved address selected, use form data
					if (!addressInput) {
						addressInput = getAddressInputData({
							...billingData.formData,
							countryCode: billingData.countryCode,
						});
					}

					const result = await updateBillingAddress({
						checkoutId: checkout.id,
						billingAddress: addressInput,
						languageCode: localeConfig.graphqlLanguageCode,
					});
					if (result.error) {
						setErrors({ streetAddress1: "Failed to update billing address" });
						return;
					}
					const billingErrors = result.data?.checkoutBillingAddressUpdate?.errors;
					if (billingErrors?.length) {
						const errorMap: Record<string, string> = {};
						billingErrors.forEach((err) => {
							const field = err.field || "streetAddress1";
							errorMap[field] = err.message || "Invalid value";
						});
						setErrors(errorMap);
						const firstField = Object.keys(errorMap)[0];
						const element = document.querySelector(`[name="${firstField}"]`) as HTMLElement;
						element?.focus();
						return;
					}
				} else if (shippingAddress) {
					// Copy shipping address to billing
					const addressInput = getAddressInputData({
						firstName: shippingAddress.firstName || "",
						lastName: shippingAddress.lastName || "",
						streetAddress1: shippingAddress.streetAddress1 || "",
						streetAddress2: shippingAddress.streetAddress2 || "",
						companyName: shippingAddress.companyName || "",
						city: shippingAddress.city || "",
						postalCode: shippingAddress.postalCode || "",
						countryArea: shippingAddress.countryArea || "",
						phone: shippingAddress.phone || "",
						countryCode: shippingAddress.country?.code as CountryCode,
					});
					const result = await updateBillingAddress({
						checkoutId: checkout.id,
						billingAddress: addressInput,
						languageCode: localeConfig.graphqlLanguageCode,
					});
					if (result.error || result.data?.checkoutBillingAddressUpdate?.errors.length) {
						setErrors({ payment: "Could not save your billing address. Please try again." });
						return;
					}
				}

				// COD creates an unpaid order. Never initialize or simulate a charge.
				const result = await checkoutComplete({ checkoutId: checkout.id });
				if (result.error) {
					setErrors({ payment: "Could not place your order. Please try again." });
					return;
				}
				const completeErrors = result.data?.checkoutComplete?.errors;
				if (completeErrors?.length) {
					setErrors({ payment: completeErrors[0].message || "Could not place your order." });
					return;
				}
				const order = result.data?.checkoutComplete?.order;
				if (!order) {
					setErrors({ payment: "Order confirmation was not received. Please check before retrying." });
					return;
				}
				const newQuery = createQueryString(searchParams, { orderId: order.id });
				router.replace(`?${newQuery}`, { scroll: false });
			} catch {
				setErrors({ payment: "Could not place your order. Please check your connection and try again." });
			} finally {
				submitting.current = false;
				setIsProcessing(false);
			}
		},
		[
			sameAsBilling,
			hasShippingAddress,
			billingData,
			user?.addresses,
			shippingAddress,
			checkout.id,
			updateBillingAddress,
			checkoutComplete,
			searchParams,
			router,
		],
	);

	const isLoading = isProcessing || completeState.fetching;
	const buttonText = isLoading ? "Placing order..." : `Place order · ${totalStr}`;
	const isDisabled = isLoading;

	return (
		<form className="space-y-8" onSubmit={handleSubmit}>
			{/* Summary Context */}
			<CheckoutSummaryContext checkout={checkout} rows={summaryRows} onGoToStep={handleGoToStep} />

			<section className="space-y-4" aria-labelledby="cod-payment-heading">
				<h2 id="cod-payment-heading" className="text-lg font-semibold">
					Payment
				</h2>
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="font-medium">Cash on Delivery</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Pay {totalStr} in cash when your order is delivered. No online payment is required.
					</p>
				</div>
			</section>

			{/* Billing Address */}
			<BillingAddressSection
				billingAddress={checkout.billingAddress}
				shippingAddress={shippingAddress}
				userAddresses={authenticated ? (user?.addresses as AddressFragment[]) : undefined}
				defaultBillingAddressId={user?.defaultBillingAddress?.id}
				isShippingRequired={isShippingRequired}
				errors={errors}
				onChange={handleBillingDataChange}
				onSameAsShippingChange={setSameAsBilling}
				initialSameAsShipping={sameAsBilling}
			/>

			{/* Payment/Checkout Error Display */}
			{errors.payment && (
				<div className="border-destructive/50 bg-destructive/10 flex items-start gap-3 rounded-lg border p-4">
					<AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
					<div>
						<p className="font-medium text-destructive">Could not place order</p>
						<p className="text-destructive/80 text-sm">{errors.payment}</p>
					</div>
				</div>
			)}

			{/* Navigation */}
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={onBack}
					className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ChevronLeft className="h-4 w-4" />
					{isShippingRequired ? "Return to shipping" : "Return to information"}
				</button>
				<Button type="submit" disabled={isDisabled} className="hidden h-12 min-w-[200px] px-8 md:flex">
					{isLoading ? (
						<span className="flex items-center gap-2">
							<LoadingSpinner />
							{buttonText}
						</span>
					) : (
						buttonText
					)}
				</Button>
			</div>

			<MobileStickyAction
				step={getStepNumber("PAYMENT", isShippingRequired)}
				isShippingRequired={isShippingRequired}
				type="submit"
				isLoading={isLoading}
				disabled={isDisabled}
				total={totalStr}
				loadingText="Placing order..."
			/>
		</form>
	);
};
