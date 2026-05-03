# Graph Report - foodRescue  (2026-05-03)

## Corpus Check
- 65 files · ~114,708 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 231 nodes · 242 edges · 23 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `DeliveryController` - 11 edges
2. `AuthController` - 8 edges
3. `DeliveryRepository` - 8 edges
4. `DonationRepository` - 6 edges
5. `AdminController` - 5 edges
6. `DonationController` - 5 edges
7. `DonorController` - 5 edges
8. `NotificationController` - 5 edges
9. `UserRepository` - 5 edges
10. `EmailService` - 5 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (18): approveVolunteer(), checkSession(), createDonation(), createRequest(), getAllUsers(), getAvailableDonations(), getDeliveryDetails(), getDonationsNearMe() (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (3): DeliveryController, DeliveryRepository, EmailService

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (4): DonorController, RequestController, RequestRepository, UserRepository

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (7): assignDelivery(), completeDelivery(), getAvailableDeliveries(), getDonorDeliveries(), getMyTasks(), trackDelivery(), verifyPickupOtp()

### Community 4 - "Community 4"
Cohesion: 0.2
Nodes (2): DataInitializer, AuthController

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (2): DonationController, DonationRepository

### Community 6 - "Community 6"
Cohesion: 0.24
Nodes (2): NotificationController, NotificationRepository

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (3): StatCard(), useCountUp(), getImpactStats()

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (1): AdminController

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (2): getNgoDeliveries(), ngoVerifyDelivery()

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (1): VolunteerController

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (2): WebConfig, WebMvcConfigurer

### Community 12 - "Community 12"
Cohesion: 0.5
Nodes (1): PublicController

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (1): FoodRescueApplication

### Community 14 - "Community 14"
Cohesion: 0.67
Nodes (1): UserController

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (1): FoodRescueApplicationTests

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (1): getTestimonials()

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (1): registerUser()

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (1): Delivery

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (1): Donation

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (1): Notification

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (1): Request

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (1): User

## Knowledge Gaps
- **5 isolated node(s):** `Delivery`, `Donation`, `Notification`, `Request`, `User`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 4`** (14 nodes): `DataInitializer.java`, `AuthController.java`, `DataInitializer`, `.initDatabase()`, `AuthController`, `.generateNgoId()`, `.getCurrentUser()`, `.login()`, `.logout()`, `.register()`, `.resendCode()`, `.verify()`, `.findByEmail()`, `.sendVerificationEmail()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (12 nodes): `DonationController.java`, `DonationRepository.java`, `DonationController`, `.createDonation()`, `.getAvailableDonations()`, `.getNearDonations()`, `.viewDonation()`, `DonationRepository`, `.findByStatus()`, `.findByStatusAndLocationNear()`, `.findByStatusIn()`, `.findByStatusInAndLocationNear()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (10 nodes): `NotificationController.java`, `NotificationRepository.java`, `NotificationController`, `.getUnreadCount()`, `.getUserNotifications()`, `.markAllAsRead()`, `.markAsRead()`, `NotificationRepository`, `.countByRecipientIdAndReadFalse()`, `.findByRecipientIdOrderByCreatedAtDesc()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (6 nodes): `AdminController.java`, `AdminController`, `.getAllDonations()`, `.getAllUsers()`, `.getGlobalStats()`, `.verifyUser()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (6 nodes): `NGOActiveDeliveries.jsx`, `NGODashboard.jsx`, `NGOActiveDeliveries()`, `NGODashboard()`, `getNgoDeliveries()`, `ngoVerifyDelivery()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (5 nodes): `VolunteerController.java`, `VolunteerController`, `.approveVolunteer()`, `.getNgoVolunteers()`, `.rejectVolunteer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (4 nodes): `WebConfig.java`, `WebConfig`, `.addCorsMappings()`, `WebMvcConfigurer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (4 nodes): `PublicController.java`, `PublicController`, `.getImpactStats()`, `.getTestimonials()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (3 nodes): `FoodRescueApplication`, `.main()`, `FoodRescueApplication.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (3 nodes): `UserController.java`, `UserController`, `.updateUser()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (3 nodes): `FoodRescueApplicationTests`, `.contextLoads()`, `FoodRescueApplicationTests.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (3 nodes): `Testimonials()`, `Testimonials.jsx`, `getTestimonials()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (3 nodes): `Register.jsx`, `Register()`, `registerUser()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `Delivery.java`, `Delivery`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `Donation.java`, `Donation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `Notification.java`, `Notification`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `Request.java`, `Request`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `User.java`, `User`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DonationRepository` connect `Community 5` to `Community 2`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `Delivery`, `Donation`, `Notification` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._