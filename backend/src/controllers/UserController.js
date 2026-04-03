const prisma = require('../utils/prismaClient');

class UserController {
  async updateProfile(req, res) {
    try {
      const { age, weight, targetWeight, height, trainingType, gender } = req.body;
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          age: age ? parseInt(age) : null,
          weight: weight ? parseFloat(weight) : null,
          targetWeight: targetWeight ? parseFloat(targetWeight) : null,
          height: height ? parseFloat(height) : null,
          trainingType: trainingType || null,
          gender: gender || null,
          profileCompleted: true
        }
      });

      return res.status(200).json({ 
        message: 'Profile updated successfully',
        user: { 
          id: updatedUser.id, 
          name: updatedUser.name, 
          email: updatedUser.email,
          age: updatedUser.age,
          weight: updatedUser.weight,
          targetWeight: updatedUser.targetWeight,
          height: updatedUser.height,
          trainingType: updatedUser.trainingType,
          gender: updatedUser.gender,
          profileCompleted: updatedUser.profileCompleted
        } 
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Internal server error while updating profile' });
    }
  }
}

module.exports = new UserController();
