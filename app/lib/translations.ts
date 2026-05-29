export type Locale = 'en' | 'vi';

export const translations = {
	en: {
		nav: {
			home: 'home',
			writing: 'writing',
			portfolio: 'portfolio',
		},
		menu: {
			writing: {
				label: 'writing',
				description: 'sometimes less is more',
			},
			portfolio: {
				label: 'portfolio',
				description: 'a collection of pain',
			},
			cv: {
				label: 'profile',
				description: 'experience & skills',
			},
		},
		home: {
			name: 'thái.',
			bio: 'specialist in turning coffee into risky lines of code. this is where i archive my grind and chaotic lessons along the way:)',
			location: 'engineer / 2026',
		},
		blog: {
			listTitle: 'writing list.',
			subtitle: 'technical notes and docs around performance and minimalist engineering.',
			search: '',
			noEntries: 'no entries found.',
		}
	},
	vi: {
		nav: {
			home: 'trang chính',
			writing: 'bài viết',
			portfolio: 'dự án',
		},
		menu: {
			writing: {
				label: 'bài viết',
				description: 'ít hơn đôi khi lại là nhiều hơn',
			},
			portfolio: {
				label: 'dự án',
				description: 'tuyển tập nỗi đau',
			},
			cv: {
				label: 'tiểu sử',
				description: 'kinh nghiệm & kỹ năng',
			},
		},
		home: {
			name: 'thái.',
			bio: 'chuyên gia chuyển hoá cà phê thành những dòng code đầy rủi ro. nơi lưu trữ hành trình làm giàu cho các tiệm thuốc tây:)',
			location: 'kỹ sư phần mềm / 2026',
		},
		blog: {
			listTitle: 'ghi chép',
			subtitle: 'những giải pháp phức tạp cho các vấn đề tối giản',
			search: '',
			noEntries: 'không tìm thấy bài viết nào.',
		}
	}
};
