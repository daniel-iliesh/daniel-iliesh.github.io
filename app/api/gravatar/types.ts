export interface GravatarVerifiedAccount {
    service_type: string;
    service_label: string;
    service_icon: string;
    url: string;
    is_hidden: boolean;
}

export interface GravatarLanguage {
    code: string;
    name: string;
    is_primary: boolean;
    order: number;
}

export interface GravatarLink {
    label: string;
    url: string;
}

export interface GravatarInterest {
    id: number;
    name: string;
    slug: string;
}

export interface GravatarPayments {
    links: GravatarLink[];
    crypto_wallets: any[]; // Could be typed if structure is known
}

export interface GravatarContactInfo {
    cell_phone: string;
    email: string;
    calendar: string;
}

export interface GravatarSectionVisibility {
    hidden_contact_info: boolean;
    hidden_feeds: boolean;
    hidden_links: boolean;
    hidden_interests: boolean;
    hidden_wallet: boolean;
    hidden_photos: boolean;
    hidden_verified_accounts: boolean;
}

export interface GravatarProfile {
    hash: string;
    display_name: string;
    profile_url: string;
    avatar_url: string;
    avatar_alt_text: string;
    location: string;
    description: string;
    job_title: string;
    company: string;
    verified_accounts: GravatarVerifiedAccount[];
    pronunciation: string;
    pronouns: string;
    timezone: string;
    languages: GravatarLanguage[];
    first_name: string;
    last_name: string;
    is_organization: boolean;
    header_image: string;
    background_color: string;
    links: GravatarLink[];
    interests: GravatarInterest[];
    payments: GravatarPayments;
    contact_info: GravatarContactInfo;
    gallery: any[]; // Could be typed if structure is known
    number_verified_accounts: number;
    last_profile_edit: string; // ISO date string
    registration_date: string; // ISO date string
    section_visibility: GravatarSectionVisibility;
}
