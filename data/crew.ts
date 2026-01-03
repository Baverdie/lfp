export interface Car {
	model: string;
	year: string;
	photos: string[];
	specs: {
		engine: string;
		power: string;
		modifications: string;
	};
	story: string;
}

export interface CrewMember {
	id: number;
	name: string;
	role: string;
	instagram: string;
	photo: string;
	bio: string;
	cars: Car[];
}

export const crewData: CrewMember[] = [
	{
		id: 1,
		name: 'Gatien',
		role: 'Fondateur',
		instagram: 'https://instagram.com/gatienchauvet',
		photo: '/images/crew/gatien.jpg',
		bio: 'Passionné de BMW depuis toujours, fondateur de LFP. Toujours à la recherche de la prochaine perle rare.',
		cars: [
			{
				model: 'BMW E30 316',
				year: '1988',
				photos: [
					'/images/cars/bmw-e30-316-1.jpg',
					'/images/cars/bmw-e30-316-2.jpg',
				],
				specs: {
					engine: '1.6L Essence',
					power: '102ch',
					modifications: 'Châssis sport, Échappement',
				},
				story: 'La pureté à l\'état brut. Une E30 316 restaurée avec passion, alliant légèreté et agilité pour une expérience de conduite inégalée.',
			},
			{
				model: 'BMW E34 520i',
				year: '1993',
				photos: [
					'https://scontent-cdg4-2.cdninstagram.com/v/t51.82787-15/581817272_18001406585832475_5935688260465934126_n.webp?_nc_cat=103&ig_cache_key=Mzc2NzI1NTEwNjM1NDcxODQ3Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=z1kPXPBjEBIQ7kNvwFnTXWL&_nc_oc=Adkw07vU8LPfwyqjZkrlWR82c1I_iCn8-MpJIW_JN4BIuo23J60c8qIIPvP77LE2Mal2UOpkVpZm-kRugCedkbbh&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-2.cdninstagram.com&_nc_gid=WrKBD6EPWSjA8kGs2NV9yA&oh=00_AfkssGqBpda1LTAk-N8fRo52eLREo1P824_0GyO32FU5_A&oe=695AD42C',
				],
				specs: {
					engine: '2.0L Essence',
					power: '147ch',
					modifications: 'Stock',
				},
				story: 'Icône des années 90, cette 190E incarne l\'élégance intemporelle de Mercedes-Benz. Un classique qui ne prend pas une ride.',
			}
		]
	},
	{
		id: 2,
		name: 'Paul',
		role: 'Membre',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
		bio: 'Les berlines E34, c\'est l\'élégance à l\'état pur. Classe et puissance.',
		cars: [
			{
				model: 'BMW E34 520i',
				year: '1993',
				photos: [
					'https://scontent-cdg4-2.cdninstagram.com/v/t51.82787-15/581817272_18001406585832475_5935688260465934126_n.webp?_nc_cat=103&ig_cache_key=Mzc2NzI1NTEwNjM1NDcxODQ3Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=z1kPXPBjEBIQ7kNvwFnTXWL&_nc_oc=Adkw07vU8LPfwyqjZkrlWR82c1I_iCn8-MpJIW_JN4BIuo23J60c8qIIPvP77LE2Mal2UOpkVpZm-kRugCedkbbh&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-2.cdninstagram.com&_nc_gid=WrKBD6EPWSjA8kGs2NV9yA&oh=00_AfkssGqBpda1LTAk-N8fRo52eLREo1P824_0GyO32FU5_A&oe=695AD42C',
				],
				specs: {
					engine: '2.0L Essence',
					power: '147ch',
					modifications: 'Stock',
				},
				story: 'Icône des années 90, cette 190E incarne l\'élégance intemporelle de Mercedes-Benz. Un classique qui ne prend pas une ride.',
			}
		]
	},
	{
		id: 3,
		name: 'Nathan',
		role: 'Membre',
		instagram: 'https://instagram.com/nathancoste',
		photo: '/images/crew/nathan.jpg',
		bio: 'Puriste E30. Pour moi, rien ne vaut la légèreté et la maniabilité d\'une vraie BMW des années 80.',
		cars: [
			{
				model: 'BMW E30',
				year: '1987',
				photos: [
					'https://scontent-cdg4-3.cdninstagram.com/v/t51.82787-15/560067280_17996812793832475_1126276156469481730_n.webp?_nc_cat=110&ig_cache_key=MzczNjgyODE5MTU3NTk2Mjg5Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxOS5zZHIuQzMifQ%3D%3D&_nc_ohc=4BPiljn4oPkQ7kNvwHfA7sG&_nc_oc=Adkp-kMDrzyf5V95lMVJ_LlqyPDWnBbDiSA9D5ACobZ-ie3bZ5nADCe3pcYYAbLes0seUxB8loqGzgXkO13MxMs9&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-3.cdninstagram.com&_nc_gid=J8-E6n9kfiS0iwESEn_jIA&oh=00_AflVUTWE7tXeg3mdL4-yHZvtOzgMdIvJ0Oat9cdtgX87ag&oe=695AD34D',
				],
				specs: {
					engine: '1.8L Essence',
					power: '113ch',
					modifications: 'Échappement sport, Coilovers',
				},
				story: 'La légende des années 80. Pure, légère, maniable. Une E30 qui respire le plaisir de conduite à l\'état brut.',
			}
		]
	},
	{
		id: 4,
		name: 'Mathéo',
		role: 'Membre',
		instagram: 'https://instagram.com/mathrss17',
		photo: '/images/crew/paul.jpg',
		bio: 'Diesel power ! La 330cd, c\'est le meilleur des deux mondes : confort et performances.',
		cars: [
			{
				model: 'BMW E46 330cd',
				year: '2003',
				photos: [
					'https://scontent-cdg4-1.cdninstagram.com/v/t51.82787-15/570651200_17999354567832475_4688603941538589168_n.webp?_nc_cat=108&ig_cache_key=Mzc1MjEyNDcwMzgyNjY5ODQxMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=2cnSYrw0c-wQ7kNvwEHK-b_&_nc_oc=AdnxQJYf-GuwfXvsMvuxEWsk7x7_a94KWLr2yqeW9mwDWclXfzjkTQ_HmV4tRmkNdbJLy0DciK9dI0-feifrnfD7&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_gid=WrKBD6EPWSjA8kGs2NV9yA&oh=00_AfnIFR5XjoOV1TBLrABugrxhCA3Cqmltk8UK6VnBU_IdGA&oe=695ADB60',
				],
				specs: {
					engine: '3.0L Diesel',
					power: '204ch',
					modifications: 'Reprog, Échappement',
				},
				story: 'Diesel sportif, 204ch, couple monstre. Une E46 qui allie confort et performances.',
			}
		]
	},
	{
		id: 5,
		name: 'Paul',
		role: 'Membre',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
		bio: 'Les berlines E34, c\'est l\'élégance à l\'état pur. Classe et puissance.',
		cars: [
			{
				model: 'BMW E34 525tds',
				year: '1996',
				photos: [
					'https://scontent-cdg4-2.cdninstagram.com/v/t51.82787-15/523864529_17988817934832475_1484749742506263753_n.webp?_nc_cat=100&ig_cache_key=MzY4NjA1Mjk2NTY4ODM4MzU0NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=JlP2XOYxOasQ7kNvwGn9GQ_&_nc_oc=AdmVDpDkrf0WSEzf-gXrba5zRmY0XV46BterabzodtuQOVeXumBGYBl8vSQcav7-MttxzLU0OHFjDKmkBYQe4gSn&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-2.cdninstagram.com&_nc_gid=pxOwyrGawcgqzhN5bcqy_A&oh=00_Afn0mYpRyIL5Q2hbPpLBDz5-_tjPK5Xqna9mqz1DzPX1mQ&oe=695AFF8D',
				],
				specs: {
					engine: '2.5L Diesel',
					power: '143ch',
					modifications: 'Stock',
				},
				story: 'Berline familiale racée, TDS puissant. L\'élégance BMW des années 90.',
			}
		]
	},
	{
		id: 6,
		name: 'Lucille',
		role: 'Membre',
		instagram: 'https://instagram.com/lucillestm',
		photo: '/images/crew/paul.jpg',
		bio: 'Petite citadine, grand caractère ! Ma Polo 6N2 a du style à revendre.',
		cars: [
			{
				model: 'Volkswagen Polo 6N2',
				year: '1996',
				photos: [
					'https://scontent-cdg4-1.cdninstagram.com/v/t51.82787-15/565139745_17998340945832475_7739485872754245078_n.webp?_nc_cat=104&ig_cache_key=Mzc0NDc5NzExNzk5NTg2MTc5NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMS5zZHIuQzMifQ%3D%3D&_nc_ohc=xuOOS9hV6-IQ7kNvwFEx1p-&_nc_oc=AdmeGUM1LJzOrESpOmoxJPhfwAC4VGDZbk8skOF7Ez5YGyuwGXeuTy0Nn_MOsMjwqV9Za4qp8wPYIlpyV_5b8q1s&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_gid=J8-E6n9kfiS0iwESEn_jIA&oh=00_AfkEW0j-2Eorgq41XQpzSaGQBzDoOBMSfjsHfpUNbHM5Sg&oe=695AE7AA',
				],
				specs: {
					engine: '1.4L Essence',
					power: '60ch',
					modifications: 'Rabaissée, Jantes',
				},
				story: 'Citadine vintage, style années 90. Petite mais pleine de caractère.',
			}
		]
	},
];