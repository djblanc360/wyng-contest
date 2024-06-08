// Desc: Types of submissions
// can be expanded upon to handle multiple contests
// const submissionTypes = ['sign_up', 'image', 'video']

// object that handles multiple contests and their submission types
// Destination Anywhere: ['sign_up', 'image', 'video']
const submissionTypes = (campaign) => {
    const campaigns = {
        'Destination Anywhere': ['sign_up', 'image', 'video']
    }
    return campaigns[campaign.campaign_name] || []
}
export { submissionTypes }