import { SubscriptionLevel } from "./subscription";

export function canCreateResume(subscriptionLevel: SubscriptionLevel, currentResumeCount: number) {
    const maxResumeMap: Record<SubscriptionLevel, number> = {
        free: 1,
        pro: 3,
        pro_plus: Infinity,
    }

    const maxResumeCount = maxResumeMap[subscriptionLevel];

    return currentResumeCount < maxResumeCount;
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel) {
    return subscriptionLevel !== "free"
}

export function canUseCustomization(subscriptionLevel: SubscriptionLevel) {
    return subscriptionLevel === "pro_plus"
}