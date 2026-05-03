# Plan: Backend Volunteer Logic

## Frontmatter
- wave: 1
- files_modified:
  - f:/KrunalDey/foodRescue/backend/src/main/java/com/foodrescue/api/controller/RequestController.java
  - f:/KrunalDey/foodRescue/backend/src/main/java/com/foodrescue/api/controller/DeliveryController.java
- autonomous: true

## Tasks
<task>
<read_first>f:/KrunalDey/foodRescue/backend/src/main/java/com/foodrescue/api/controller/RequestController.java</read_first>
<action>In `respondToRequest`, when status is `ACCEPTED`, notify all volunteers affiliated with the NGO about the new delivery.</action>
<acceptance_criteria>
- `RequestController.java` contains logic to find volunteers by `affiliatedNgoId` and create notifications for them.
</acceptance_criteria>
</task>

<task>
<read_first>f:/KrunalDey/foodRescue/backend/src/main/java/com/foodrescue/api/controller/DeliveryController.java</read_first>
<action>In `assignDelivery`, send the generated OTP to the Donor's email so they can verify the volunteer.</action>
<acceptance_criteria>
- `DeliveryController.java` calls `emailService.sendNotification` to the donor with the pickup OTP.
</acceptance_criteria>
</task>
