import Image from 'next/image';

import { SITE_CONFIG } from '../lib/config';

type ProfileAvatarProps = {
	className: string;
	height: number;
	sizes: string;
	width: number;
};

export default function ProfileAvatar({ className, height, sizes, width }: ProfileAvatarProps) {
	return (
		<span data-profile-avatar className={`avatar-halo ${className}`}>
			<Image
				src={SITE_CONFIG.profile.avatar}
				alt={SITE_CONFIG.profile.name}
				width={width}
				height={height}
				className="profile-avatar-image"
				style={{
					objectFit: SITE_CONFIG.profile.avatarFit,
					objectPosition: SITE_CONFIG.profile.avatarPosition,
					transform: `scale(${SITE_CONFIG.profile.avatarScale})`,
				}}
				priority
				sizes={sizes}
			/>
		</span>
	);
}
