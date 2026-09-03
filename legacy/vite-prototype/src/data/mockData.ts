import { Service, Booking, ScheduleEvent } from '../types';

export const COACH_RICKIE_LOGO = "https://lh3.googleusercontent.com/aida-public/AB6AXuDmfP7tUxVfbmAL-s-DFFfvrhEJL2o-gkwNn5518BDm3OIfByts_snX2MNh6PrUm2o2o-4nYRaG7-Ku1DlraMq-21iTR3AxqvAeOr6PB0BXRsOFbb-rZxZ7MMrMkUbcBQdvppM1fMCPx9dYmoLISmUeKhPbMsiPNok_kCc9vXK_wmQSpct4RELGkdw2VmmjCf_opBrxOhLKcG3aGAAcMf7QmFEl91hbfzceg3rQJV6QoBqhizFvc6CV";

export const COACH_RICKIE_HERO = "https://lh3.googleusercontent.com/aida-public/AB6AXuCRETFh3SjHo2TIIcbkiakxeLhTF7Mbq7AJMyscle9gyxIDmNTYM2kMF0PplHwmuqsv60_3zGUzuRzOXzJMMMEUkx3nQMNYrPlVlxRIYPgs3hPtPvG-shxH1p3340Y99NRSl1jwQXYkryQ5aKFZjK6YNwXHxvgiM73s2lQELfEdxdPnMKNP0qCjiTTsKpLbgmcpvOiquZRQD_VaDntmGct0unx-ijqgUIYBBgFr4880BVH2hxUoSjFi";

export const COACH_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBhUZeHi3dzoN_ZgKvxACcSWJl5oo-yAxIIqZO7mduvEYaNHkV5liBzyEmKi6F0zyEFDtiBEtkiYzegHUUFTit2emagkksNUm6RXbVk-e1faNnhVYKc3ETK7fMcSZmRicFM0LpcER-SugYfhVVoDYw_okHJn9cDBhERaVp78DUeCZh1QYRyJOOBY0F9TEbwvv65C_OTn-n4S9MT_88EFVeHN7PIi6-jo4MAPKR9nrmmX9z_WiOBZ4Zq";

export const SERVICES: Service[] = [
  {
    id: 'personal',
    name: 'Personal Training',
    tag: 'INTENSE',
    tagVariant: 'intense',
    duration: 60,
    durationLabel: '60 MIN',
    subtitle: '60m • 1-on-1 coaching',
    description: 'One-on-one focused session tailored to your specific mechanical and athletic goals.',
    price: 150000,
    priceLabel: 'UGX 150,000 / Session (or Plan)',
    icon: 'fitness_center',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgpqORRLLBSppfUkjMjdtuBrEHTG180w73bYU8WrArfFcZ1faQXDa58qua3ZcdKYcirP_UjIH1NrR5Q4Vwu7LShO9d4wW7G395aGnSaXtddVgdQjIslpEyVMT8cd0YxLOa9Vl2pBddhf8GMgLsZ_-5NJp1GUorzaKVclc2fm8XrioWsvTGGYC5dr-0nYRNArAOmkSLp0vre7UtD5QoF_RnXZzYsy4LGB_RKs1wBtfzgcpnVh_mUga-',
    intensity: 'High Intensity, 1-on-1 Custom Focus',
    features: ['Custom biomechanics assessment', 'Heart-rate zone conditioning', 'Progressive overload tracking', 'Personalized recovery plan']
  },
  {
    id: 'public',
    name: 'Public Training',
    tag: 'DYNAMIC',
    tagVariant: 'dynamic',
    duration: 45,
    durationLabel: '45 MIN',
    subtitle: '45m • High-energy group workouts',
    description: 'High-intensity group sessions focusing on conditioning and raw power output.',
    price: 0,
    priceLabel: 'Free / Included in Plan',
    icon: 'groups',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-FBy4iuo5sjK39j8DNk0-xQ3lTcnWyQZPmGpvdTzienZ9s0u-P9Ku64TdkL6lwJlQjx-VzHm13WLRkmr8S-A2UWkGDJKEWPSTMssuUhSZIGThQuDZ-DhRzKYoCc8NSIhITo4C5zgmb6mK71I4xQsNR8Qc5zROqN0jOTCblVY4zKVMqQtm3GYjiqeGTtrkkLkdOn5fSG4QqWj1Z8qIOz6lIp3gwD0u1u6i6BuSOw005w4xAOhD7kCA',
    intensity: 'Maximum Group Synergy, Athletic HIIT',
    features: ['15-athlete max cap', 'Full functional training circuit', 'Live coach pacing & form corrections', 'Competitive leaderboards']
  },
  {
    id: 'smash',
    name: 'Smash Room',
    tag: 'EXTREME',
    tagVariant: 'extreme',
    duration: 30,
    durationLabel: '30 MIN',
    subtitle: '20-30m • Release stress',
    description: 'Unrestricted power release. Industrial environment built for total structural impact.',
    price: 80000,
    priceLabel: 'UGX 80,000 / Session',
    icon: 'sports_baseball',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNN47XqnTadfSI69GVp84m4zO8UUhv1dGCIYZKqrhzEua9m26nqDsLfUmH1xeVSReWFrJtd4U0iyYKjjGCZG9jrWoUZrsmSU-JtuxhtzTaxyhv_hX4N0j2QBtpMQDOwrJPf67r7aIFuv-Nt2Yq1oAWftPPXkr2M2yftNbhLv9MtqQQqF73RgYL1gvGA_O7WDgWIsPobdrnFkpBVgOBEk3_i4lbMLx_zjWhBRCiu7pB8pPULx3g_JYr',
    intensity: 'Extreme Cathartic Destruction',
    features: ['Protective tactical armor provided', 'Sledgehammers, bats, and steel pipes', 'Custom audio playlist control', 'Targeted structural demolition zones']
  },
  {
    id: 'recovery',
    name: 'Recovery',
    tag: 'CHILL',
    tagVariant: 'chill',
    duration: 30,
    durationLabel: '30 MIN',
    subtitle: '30m • Stretch and reset',
    description: 'Targeted myofascial release, cold-water therapy, and guided mobility protocols.',
    price: 60000,
    priceLabel: 'UGX 60,000 / Session (or Plan)',
    icon: 'self_improvement',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhUZeHi3dzoN_ZgKvxACcSWJl5oo-yAxIIqZO7mduvEYaNHkV5liBzyEmKi6F0zyEFDtiBEtkiYzegHUUFTit2emagkksNUm6RXbVk-e1faNnhVYKc3ETK7fMcSZmRicFM0LpcER-SugYfhVVoDYw_okHJn9cDBhERaVp78DUeCZh1QYRyJOOBY0F9TEbwvv65C_OTn-n4S9MT_88EFVeHN7PIi6-jo4MAPKR9nrmmX9z_WiOBZ4Zq',
    intensity: 'Restorative & Deep Tissue Regeneration',
    features: ['Contrast ice & infrared baths', 'Pneumatic compression boots', 'Assisted PNF stretching', 'Guided respiratory reset']
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-01',
    referenceNumber: 'CR-20241015-00482',
    serviceId: 'public',
    serviceName: 'Public Training Session',
    serviceTag: 'ADVANCED HIIT',
    client: {
      fullName: 'Brian Mukasa',
      email: 'brian.mukasa@gmail.com',
      phone: '+256 772 458 912',
      goals: 'Improve VO2 max, rugby sprint power, agility',
      injuries: 'None'
    },
    date: '2024-10-24',
    timeSlot: '08:00 AM',
    endTime: '08:45 AM',
    status: 'Confirmed',
    price: 'Free / Included in Plan',
    location: 'Coach Rickie Studio, Lugogo Bypass, Kampala',
    createdAt: '2024-10-18T10:30:00Z',
    notes: 'Returning elite member • Kampala Old Boys Rugby'
  },
  {
    id: 'b-02',
    referenceNumber: 'CR-20241024-00109',
    serviceId: 'personal',
    serviceName: 'Personal Training Session',
    serviceTag: '1-ON-1 STRENGTH',
    client: {
      fullName: 'Patricia Namubiru',
      email: 'patricia.namubiru@gmail.com',
      phone: '+256 701 834 567',
      goals: 'Deadlift mechanics, posterior chain power for Kampala Marathon',
      injuries: 'Mild lower back tightness from desk work'
    },
    date: '2024-10-24',
    timeSlot: '10:30 AM',
    endTime: '11:30 AM',
    status: 'Confirmed',
    price: 'UGX 150,000',
    location: 'Coach Rickie Studio, Lugogo Bypass, Kampala',
    createdAt: '2024-10-20T14:15:00Z',
    notes: 'Focus on hip hinge warm-up & glute activation'
  },
  {
    id: 'b-03',
    referenceNumber: 'CR-20241024-00334',
    serviceId: 'smash',
    serviceName: 'Smash Room Intro',
    serviceTag: 'SMASH ROOM INTRO',
    client: {
      fullName: 'Derrick Katende',
      email: 'derrick.katende@outlook.com',
      phone: '+256 752 911 340',
      goals: 'Work stress decompression and upper body explosive swings',
      injuries: 'None'
    },
    date: '2024-10-24',
    timeSlot: '01:00 PM',
    endTime: '01:30 PM',
    status: 'Arrived',
    price: 'UGX 80,000',
    location: 'Coach Rickie Studio, Lugogo Bypass, Kampala',
    createdAt: '2024-10-22T09:00:00Z',
    notes: 'First time in the smash cage. Heavy bats selected.'
  },
  {
    id: 'b-04',
    referenceNumber: 'CR-20241025-00781',
    serviceId: 'public',
    serviceName: 'Public Training Session',
    serviceTag: 'HIIT CORE',
    client: {
      fullName: 'Fiona Nakato',
      email: 'fiona.nakato@yahoo.com',
      phone: '+256 782 667 890',
      goals: 'Core stability, boxing conditioning and endurance',
      injuries: 'Right shoulder impingement history'
    },
    date: '2024-10-25',
    timeSlot: '08:00 AM',
    endTime: '09:00 AM',
    status: 'Confirmed',
    price: 'Free / Included in Plan',
    location: 'Coach Rickie Studio, Lugogo Bypass, Kampala',
    createdAt: '2024-10-23T11:20:00Z'
  },
  {
    id: 'b-05',
    referenceNumber: 'CR-20241026-00992',
    serviceId: 'personal',
    serviceName: 'Personal Training Session',
    serviceTag: '1:1 STRENGTH',
    client: {
      fullName: 'Joshua Kiiza',
      email: 'joshua.kiiza@gmail.com',
      phone: '+256 774 321 098',
      goals: 'Chest hypertrophy and bench press strength breakthrough',
    },
    date: '2024-10-26',
    timeSlot: '09:00 AM',
    endTime: '10:00 AM',
    status: 'Confirmed',
    price: 'UGX 150,000',
    location: 'Coach Rickie Studio, Lugogo Bypass, Kampala',
    createdAt: '2024-10-21T16:00:00Z'
  },
  {
    id: 'b-06',
    referenceNumber: 'CR-20241027-00511',
    serviceId: 'smash',
    serviceName: 'Smash Room Corporate Team',
    serviceTag: 'SMASH SESSION',
    client: {
      fullName: 'Stanbic Tech Kampala Team',
      email: 'team@stanbic.co.ug',
      phone: '+256 702 555 123',
      goals: 'Quarterly team offsite decompression and high-energy stress venting'
    },
    date: '2024-10-27',
    timeSlot: '10:00 AM',
    endTime: '11:30 AM',
    status: 'Confirmed',
    price: 'UGX 250,000',
    location: 'Coach Rickie Studio, Lugogo Bypass, Kampala',
    createdAt: '2024-10-19T08:30:00Z'
  }
];

export const INITIAL_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 'ev-1',
    title: 'Blocked Time',
    type: 'BLOCKED',
    serviceName: 'Staff Rig Calibration & Cage Armoring',
    dayOfWeek: 1, // Mon (24)
    date: '2024-10-24',
    startTime: '06:00',
    endTime: '07:30',
    colorBg: 'rgba(53, 53, 52, 0.6)',
    colorBorder: '#929090',
    colorText: '#c8c6c5'
  },
  {
    id: 'ev-2',
    title: 'HIIT Core',
    type: 'PUB',
    serviceName: 'Public Training',
    dayOfWeek: 3, // Wed (26)
    date: '2024-10-26',
    startTime: '08:00',
    endTime: '09:00',
    attendees: '12/15',
    colorBg: '#3d1a11',
    colorBorder: '#ff5625',
    colorText: '#ffb5a0'
  },
  {
    id: 'ev-3',
    title: '1:1 Strength',
    type: 'PT',
    serviceName: 'Personal Training',
    dayOfWeek: 4, // Thu (27)
    date: '2024-10-27',
    startTime: '09:00',
    endTime: '10:00',
    clientName: 'Joshua Kiiza',
    colorBg: '#1e2329',
    colorBorder: '#60a5fa',
    colorText: '#93c5fd'
  },
  {
    id: 'ev-4',
    title: 'Smash Session',
    type: 'SMR',
    serviceName: 'Smash Room',
    dayOfWeek: 5, // Fri (28)
    date: '2024-10-28',
    startTime: '10:00',
    endTime: '11:30',
    clientName: 'Stanbic Team',
    colorBg: '#2a0e0e',
    colorBorder: '#ffb4ab',
    colorText: '#ffb4ab'
  }
];

export const CLIENT_PROFILES = [
  {
    id: 'c-1',
    name: 'Brian Mukasa',
    email: 'brian.mukasa@gmail.com',
    phone: '+256 772 458 912',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8xMnMorJACf2olTitQUj3TdYcXb3gGMRdqQcVOZaRBvwxazBaLOj6upVDaSQK7JJ-JNgOLUBjF__wL_c5mvT9B9YgTdJr9kvybW3ztzGQbxEJHDytHndniOfspXZv79n6DY0_4B9Q03_gMg1o2pvtVWMH1Vy478VyloWRZ8jzy1yVMGojXYvj4cDJxbYDrSOsam-QUHEyypqoB80boyJXRPRcyDxvGJE2CaJAxcWyUsSZKoTqmpAS',
    tier: 'All-Access Pro',
    sessionsAttended: 42,
    goals: 'VO2 Max elevation, Powerlifting PRs, Rugby Conditioning',
    injuries: 'None. Excellent mobility.',
    status: 'Active'
  },
  {
    id: 'c-2',
    name: 'Patricia Namubiru',
    email: 'patricia.namubiru@gmail.com',
    phone: '+256 701 834 567',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJMkVPvVxxSdETfMsuF8tdiH-B7RTNJAcUAV2WwUd0zCq2RNvVNj5gJq5kmiY6HVpoj1uEjNi7lz9ZJ9yZA6kzMjCOAX_AEG5xvjhi6Yd5Xtpq8dgUIQI1FSFzoGXQmEqloj-kJi9LClX5LoMwifcTqnVqNmpZuuhMard6-2xDzYR74kVsg2nWnfVJSPpICksKSlgs8ozMh5Gb5mr6vj37E9EpiD5kVj_E8RnKHt9cuHBQ1BR81gWI',
    tier: '1-on-1 Elite',
    sessionsAttended: 18,
    goals: 'Posterior chain strength, deadlift form, marathon recovery',
    injuries: 'Occasional lumbar tightness from long office hours',
    status: 'Active'
  },
  {
    id: 'c-3',
    name: 'Derrick Katende',
    email: 'derrick.katende@outlook.com',
    phone: '+256 752 911 340',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsgKQD_qsnJM3lkWr2FvDRQMqN4EGt3Ck6XB-yUjFAUXgPpPWHao624Y9aifsdwel64fORN0-b4DvIQCIW5zZAL-4vBf8yJuqhb2t3MA8hQdma2lrLY9tsGKK-iEyQIz3mWzk-B9BBWPVn8K8a49Ogp2Yut3QldBS7Cz5nRr4r8zZuFmSOxiLP259VxlJFicXm44x-RHTfVon2psMFxLvAP_LbpBxXYp99HhK1kyyyHu8qEzXAreHM',
    tier: 'Smash & Conditioning',
    sessionsAttended: 8,
    goals: 'Stress management, dynamic upper body explosive power',
    injuries: 'None',
    status: 'Active'
  }
];

export const TIME_SLOTS_BY_DATE: Record<string, { time: string; spots: number; status: 'available' | 'full'; section: 'morning' | 'evening' }[]> = {
  default: [
    { time: '06:00 AM', spots: 3, status: 'available', section: 'morning' },
    { time: '07:00 AM', spots: 1, status: 'available', section: 'morning' },
    { time: '08:00 AM', spots: 4, status: 'available', section: 'morning' },
    { time: '09:00 AM', spots: 0, status: 'full', section: 'morning' },
    { time: '10:30 AM', spots: 2, status: 'available', section: 'morning' },
    { time: '05:00 PM', spots: 1, status: 'available', section: 'evening' },
    { time: '06:00 PM', spots: 5, status: 'available', section: 'evening' },
    { time: '07:00 PM', spots: 2, status: 'available', section: 'evening' }
  ]
};
