import HomepageBanner from "../../models/HomepageBanner.js";
import path from 'path';
import fs from 'fs';
import { log } from "../../services/LogService.js";
export const uploadHomePageBanner = async (req, res) => {
  try {
    const bannerFile = req.file;

    if (!bannerFile) {
      return res.status(400).json({ error: 'Banner image is required.' });
    }


    const filename = path.basename(bannerFile.path);

    const newBanner = await HomepageBanner.create({
      banner: filename,
      is_active: true,
    });
     await log({
      req,
      action:"CREATE",
      page_name:"ADD HOMEPAGE BANNER",
      target: newBanner.banner,
     
    });

    return res.status(201).json({
      message: 'Homepage banner uploaded successfully',
      banner: newBanner,
    });
  } catch (error) {
    console.error('Upload Banner Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
export const getAllHomePageBanners = async (req, res) => {
  try {
    const banners = await HomepageBanner.findAll({
      order: [["created_at", "DESC"]], // latest first
    });

    const bannersWithUrls = banners.map((banner) => {
      const bannerData = banner.toJSON();

      // Normalize filename
      const filename = (bannerData.banner || "").replace(/\\/g, "/");

      const imageUrl = filename
        ? `${req.protocol}://${req.get("host")}/uploads/banners/${filename}`
        : null;

      return {
        ...bannerData,
        image_url: imageUrl,
      };
    });
    await log({
      req,
      action:"READ ",
      page_name:"HOMEPAGE BANNER LIST",
      // target: newBanner.banner,
     
    });
    return res.status(200).json({
      message: "Homepage banners fetched successfully",
      banners: bannersWithUrls,
    });
  } catch (error) {
    console.error("Get Banners Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateHomePageBanner = async (req, res) => {
  const bannerId = req.params.id;

  try {
    const bannerRecord = await HomepageBanner.findByPk(bannerId);

    if (!bannerRecord) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Handle new uploaded file (replace existing)
    if (req.file) {
      const newFilename = path.basename(req.file.path);

      // Delete old image file if exists
      if (bannerRecord.banner) {
        const oldFilePath = path.join(
          process.cwd(),
          'public',
          'uploads',
          'banners',
          bannerRecord.banner
        );

        fs.access(oldFilePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldFilePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Error deleting old banner:', unlinkErr);
              }
            });
          }
        });
      }

      bannerRecord.banner = newFilename;
    } else if (req.body.banner !== undefined) {
      // Handle banner removal if frontend sends empty string
      if (req.body.banner === "") {
        // Delete old image file if exists
        if (bannerRecord.banner) {
          const oldFilePath = path.join(
            process.cwd(),
            'public',
            'uploads',
            'banners',
            bannerRecord.banner
          );

          fs.access(oldFilePath, fs.constants.F_OK, (err) => {
            if (!err) {
              fs.unlink(oldFilePath, (unlinkErr) => {
                if (unlinkErr) {
                  console.error('Error deleting old banner:', unlinkErr);
                }
              });
            }
          });
        }

        // Clear banner field in DB
        bannerRecord.banner = null;
      }
      // If req.body.banner has some other value (unlikely in your case), you could handle here if needed
    }

    // Update is_active if provided
    if (req.body.is_active !== undefined) {
      bannerRecord.is_active =
        req.body.is_active === 'true' || req.body.is_active === true;
    }

    bannerRecord.updated_at = new Date();

    await bannerRecord.save();

    await log({
      req,
      action:"UPDATE ",
      page_name:"HOMEPAGE BANNER FORM ",
      target: bannerRecord.banner,
     
    });
    return res.status(200).json({
      message: 'Homepage banner updated successfully',
      banner: bannerRecord,
    });
  } catch (error) {
    console.error('Error updating homepage banner:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getHomePageBannerById = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await HomepageBanner.findByPk(id);

    if (!banner) {
      return res.status(404).json({ message: 'Homepage banner not found' });
    }

    const bannerData = banner.toJSON();

    // Normalize and construct full image URL
    const filename = (bannerData.banner || "").replace(/\\/g, "/");

    const imageUrl = filename
      ? `${req.protocol}://${req.get("host")}/uploads/banners/${filename}`
      : null;

      await log({
      req,
      action:"READ ",
      page_name:"HOMEPAGE BANNER FORM ",
      // target: bannerRecord.banner,
     
     });

    return res.status(200).json({
      message: 'Homepage banner fetched successfully',
      banner: {
        ...bannerData,
        image_url: imageUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching homepage banner by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const toggleHomepageBannerStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await HomepageBanner.findByPk(id);

    if (!banner) {
      return res.status(404).json({ message: 'Homepage banner not found' });
    }

    banner.is_active = !banner.is_active; // Toggle status
    await banner.save();
    await log({ 
      req,
      action:"UPDATE ",
      page_name:"HOMEPAGE BANNER LIST ",
      target: banner.banner,
     
    });

    res.status(200).json({
      message: `Homepage banner status changed to ${banner.is_active ? 'Active' : 'Inactive'}`,
      banner,
    });
  } catch (error) {
    console.error('Error toggling homepage banner status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



