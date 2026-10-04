import { User, StoreMember } from '../types';

export const ADMIN_EMAIL = 'mohamedukkas.ai@gmail.com';

/**
 * Checks whether the email belongs to the FreshMart system administrator (Mohamed Ukkas).
 */
export function isUserAdmin(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export interface AuthenticatedSession {
  user: User;
  isAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
  targetState: 'admin' | 'staff' | 'storefront';
}

export interface RecognizedMemberInfo {
  type: 'admin' | 'manager' | 'staff' | 'customer';
  displayName: string;
  roleTitle: string;
  id: string;
  email: string;
  targetState: 'admin' | 'staff' | 'storefront';
}

/**
 * Normalizes email input by trimming and converting to lowercase.
 */
export function normalizeAuthInput(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Returns real-time identification for an email.
 */
export function identifyInputRole(
  input: string,
  managersList?: StoreMember[],
  staffList?: StoreMember[]
): RecognizedMemberInfo | null {
  if (!input.trim()) return null;
  const cleanEmail = normalizeAuthInput(input);

  // 1. Super Admin: Mohamed Ukkas
  if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
    return {
      type: 'admin',
      displayName: 'Mohamed Ukkas',
      roleTitle: 'Super Administrator',
      id: 'usr-admin-mohamed',
      email: ADMIN_EMAIL,
      targetState: 'admin'
    };
  }

  // 2. Store Manager: Matched by assigned email
  const currentManagers = managersList || [];
  const matchedManager = currentManagers.find(
    (m) => m.email.toLowerCase() === cleanEmail && m.status === 'active'
  );
  if (matchedManager) {
    return {
      type: 'manager',
      displayName: `${matchedManager.firstName} ${matchedManager.lastName}`,
      roleTitle: `Store Manager (${matchedManager.department})`,
      id: matchedManager.id,
      email: matchedManager.email,
      targetState: 'admin'
    };
  }

  // 3. Staff: Matched by assigned email
  const currentStaff = staffList || [];
  const matchedStaff = currentStaff.find(
    (s) => s.email.toLowerCase() === cleanEmail && s.status === 'active'
  );
  if (matchedStaff) {
    const roleLabel =
      matchedStaff.role === 'STAFF_PACKER' ? 'Order Picker & Packer' :
      matchedStaff.role === 'STAFF_STOCKER' ? 'Shelf & Inventory Stocker' :
      matchedStaff.role === 'STAFF_DISPATCH' ? 'Express Courier' : 'Fulfillment Staff';

    return {
      type: 'staff',
      displayName: `${matchedStaff.firstName} ${matchedStaff.lastName}`,
      roleTitle: `${roleLabel} (${matchedStaff.department})`,
      id: matchedStaff.id,
      email: matchedStaff.email,
      targetState: 'staff'
    };
  }

  return null;
}

/**
 * Main Authentication Service:
 * Matches user by their verified email address:
 * 1. Admin: 'mohamedukkas.ai@gmail.com' -> ADMIN (targetState: 'admin')
 * 2. Store Manager: Assigned Email -> STORE_MANAGER (targetState: 'admin')
 * 3. Staff: Assigned Email -> STAFF roles (targetState: 'staff')
 * 4. All other emails -> CUSTOMER (targetState: 'storefront')
 */
export function processUserAuthentication(
  emailAddress: string,
  firstName?: string,
  lastName?: string,
  managersList?: StoreMember[],
  staffList?: StoreMember[]
): AuthenticatedSession {
  const cleanEmail = normalizeAuthInput(emailAddress);
  // The single super admin is identified from Firebase's verified account email.
  // Manager and staff roles still require trusted server verified claims.
  if (isUserAdmin(cleanEmail)) {
    const user: User = {
      id: `usr-admin-mohamed`,
      email: ADMIN_EMAIL,
      firstName: firstName?.trim() || 'Mohamed',
      lastName: lastName?.trim() || 'Ukkas',
      role: 'ADMIN'
    };

    return {
      user,
      isAdmin: true,
      isManager: false,
      isStaff: true,
      targetState: 'admin'
    };
  }

  // In this browser-only preview, an authenticated Firebase email can be matched
  // against the locally saved active roster. Production roles must come from
  // trusted server-verified claims instead of browser-managed lists.
  const matchedManager = managersList?.find(
    (member) => member.email.trim().toLowerCase() === cleanEmail && member.status === 'active'
  );
  const matchedStaff = staffList?.find(
    (member) => member.email.trim().toLowerCase() === cleanEmail && member.status === 'active'
  );
  const matchedMember = matchedManager || matchedStaff;
  if (matchedMember) {
    const user: User = {
      id: matchedMember.id,
      email: cleanEmail,
      firstName: firstName?.trim() || matchedMember.firstName,
      lastName: lastName?.trim() || matchedMember.lastName,
      role: matchedMember.role,
      phone: matchedMember.phone
    };

    return {
      user,
      isAdmin: false,
      isManager: matchedMember.role === 'STORE_MANAGER',
      isStaff: matchedMember.role !== 'STORE_MANAGER',
      targetState: matchedMember.role === 'STORE_MANAGER' ? 'admin' : 'staff'
    };
  }

  // 4. Regular Customer (All other emails)
  const user: User = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    firstName:
      firstName?.trim() ||
      (cleanEmail.split('@')[0].charAt(0).toUpperCase() +
        cleanEmail.split('@')[0].slice(1)),
    lastName: lastName?.trim() || '',
    role: 'CUSTOMER',
    phone: '+91 98765 43210'
  };

  return {
    user,
    isAdmin: false,
    isManager: false,
    isStaff: false,
    targetState: 'storefront'
  };
}

export function getPostLoginState(
  email: string,
  managersList?: StoreMember[],
  staffList?: StoreMember[]
): 'admin' | 'staff' | 'storefront' {
  return processUserAuthentication(email, undefined, undefined, managersList, staffList).targetState;
}
