"use client";

import { useEffect, useState } from "react";
import { Save, Globe, Phone, Mail, MapPin, Sparkles, Award } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getCompanySettings, updateCompanySettings, logActivity } from "@/lib/firebase/db";
import { CompanySettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  const { user } = useAdminAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields State
  const [name, setName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutStory, setAboutStory] = useState("");
  const [aboutMission, setAboutMission] = useState("");
  const [aboutVision, setAboutVision] = useState("");
  const [footerText, setFooterText] = useState("");

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoGoogleVerification, setSeoGoogleVerification] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getCompanySettings();
      if (data) {
        setSettings(data);
        setName(data.name);
        setPhone1(data.phoneNumbers[0] || "");
        setPhone2(data.phoneNumbers[1] || "");
        setEmail(data.email);
        setAddress(data.address);
        setGoogleMapsUrl(data.googleMapsUrl);

        setFacebook(data.socialLinks.facebook || "");
        setTwitter(data.socialLinks.twitter || "");
        setInstagram(data.socialLinks.instagram || "");
        setLinkedin(data.socialLinks.linkedin || "");

        setHeroTitle(data.hero.title);
        setHeroSubtitle(data.hero.subtitle);
        setAboutTitle(data.about.title);
        setAboutStory(data.about.story);
        setAboutMission(data.about.mission);
        setAboutVision(data.about.vision);
        setFooterText(data.footer.text);

        setSeoTitle(data.seo.metaTitle);
        setSeoDesc(data.seo.metaDescription);
        setSeoKeywords(data.seo.keywords);
        setSeoGoogleVerification(data.seo.googleVerification || "");
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated: CompanySettings = {
        name: name.trim(),
        phoneNumbers: [phone1.trim(), phone2.trim()].filter(p => p !== ""),
        email: email.trim(),
        address: address.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        socialLinks: {
          facebook: facebook.trim(),
          twitter: twitter.trim(),
          instagram: instagram.trim(),
          linkedin: linkedin.trim(),
        },
        hero: {
          title: heroTitle.trim(),
          subtitle: heroSubtitle.trim(),
        },
        about: {
          title: aboutTitle.trim(),
          story: aboutStory.trim(),
          mission: aboutMission.trim(),
          vision: aboutVision.trim(),
        },
        footer: {
          copyright: `© ${new Date().getFullYear()} ${name.trim()}. All Rights Reserved.`,
          text: footerText.trim(),
        },
        seo: {
          metaTitle: seoTitle.trim(),
          metaDescription: seoDesc.trim(),
          keywords: seoKeywords.trim(),
          googleVerification: seoGoogleVerification.trim(),
        },
      };

      await updateCompanySettings(updated);

      if (user?.email) {
        await logActivity(user.email, "Updated corporate configurations and business settings");
      }

      alert("Settings updated successfully!");
      setSettings(updated);
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        <div className="h-10 bg-gray-200 w-1/4 mb-4" />
        <div className="h-64 bg-gray-200 border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-charcoal">Business Settings</h1>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Configure office addresses, phone routing lines, landing section copy, and default metadata configurations.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 rounded-none mb-8 bg-gray-100 max-w-xl">
            <TabsTrigger value="profile" className="rounded-none text-xs font-bold uppercase tracking-wider data-[state=active]:bg-maroon data-[state=active]:text-white">
              Company Profile
            </TabsTrigger>
            <TabsTrigger value="content" className="rounded-none text-xs font-bold uppercase tracking-wider data-[state=active]:bg-maroon data-[state=active]:text-white">
              Homepage Copy
            </TabsTrigger>
            <TabsTrigger value="seo" className="rounded-none text-xs font-bold uppercase tracking-wider data-[state=active]:bg-maroon data-[state=active]:text-white">
              SEO Metatags
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="flex flex-col gap-6">
            <Card className="rounded-none border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold font-heading text-maroon flex items-center gap-2">
                  <MapPin className="h-4.5 w-4.5 text-gold-dark" /> Corporate Contact Coordinates
                </CardTitle>
                <CardDescription className="text-xs">Physical address details, contact numbers, and maps embed queries.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Business Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-none border-gray-300" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Official email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-none border-gray-300" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Phone Channel #1</Label>
                  <Input value={phone1} onChange={(e) => setPhone1(e.target.value)} required className="rounded-none border-gray-300" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Phone Channel #2</Label>
                  <Input value={phone2} onChange={(e) => setPhone2(e.target.value)} className="rounded-none border-gray-300" />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Office & Processing Facility Address</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} required className="rounded-none border-gray-300" />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Google Maps Embed query URL (iFrame src)</Label>
                  <Input value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)} className="rounded-none border-gray-300 text-xs" />
                </div>

              </CardContent>
            </Card>

            <Card className="rounded-none border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold font-heading text-maroon flex items-center gap-2">
                  <Globe className="h-4.5 w-4.5 text-gold-dark" /> Social Links Configurations
                </CardTitle>
                <CardDescription className="text-xs">Social accounts visible in the public footer block.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Facebook URL</Label>
                  <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="rounded-none border-gray-300 text-xs" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Twitter URL</Label>
                  <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} className="rounded-none border-gray-300 text-xs" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Instagram URL</Label>
                  <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="rounded-none border-gray-300 text-xs" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">LinkedIn Company Page URL</Label>
                  <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="rounded-none border-gray-300 text-xs" />
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Homepage Content Tab */}
          <TabsContent value="content" className="flex flex-col gap-6">
            <Card className="rounded-none border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold font-heading text-maroon flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-gold-dark" /> Homepage Copy
                </CardTitle>
                <CardDescription className="text-xs">Edit core header messages and corporate storytelling elements.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Hero Main Title (Headline)</Label>
                  <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} required className="rounded-none border-gray-300" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Hero Subtitle</Label>
                  <Textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} required rows={2} className="rounded-none border-gray-300 text-xs" />
                </div>

                <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-6">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">About Section Title</Label>
                  <Input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} required className="rounded-none border-gray-300" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">About Story Copy</Label>
                  <Textarea value={aboutStory} onChange={(e) => setAboutStory(e.target.value)} required rows={5} className="rounded-none border-gray-300 text-xs" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[10px] uppercase font-bold text-gray-400">Mission statement</Label>
                    <Textarea value={aboutMission} onChange={(e) => setAboutMission(e.target.value)} required rows={3} className="rounded-none border-gray-300 text-xs" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[10px] uppercase font-bold text-gray-400">Vision statement</Label>
                    <Textarea value={aboutVision} onChange={(e) => setAboutVision(e.target.value)} required rows={3} className="rounded-none border-gray-300 text-xs" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-6">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Footer description text</Label>
                  <Input value={footerText} onChange={(e) => setFooterText(e.target.value)} required className="rounded-none border-gray-300" />
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="flex flex-col gap-6">
            <Card className="rounded-none border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold font-heading text-maroon flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-gold-dark" /> Corporate SEO Default Metatags
                </CardTitle>
                <CardDescription className="text-xs">Configure default index titles and descriptions to boost global Google visibility.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Meta Title Tag</Label>
                  <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} required className="rounded-none border-gray-300" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Meta Description Tag</Label>
                  <Textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} required rows={4} className="rounded-none border-gray-300 text-xs" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Meta Keywords (Comma separated)</Label>
                  <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="spice exporter, sambar powder wholesale..." required className="rounded-none border-gray-300" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Google Site Verification Code (Google Search Console)</Label>
                  <Input value={seoGoogleVerification} onChange={(e) => setSeoGoogleVerification(e.target.value)} placeholder="e.g. google-site-verification-hash" className="rounded-none border-gray-300 text-xs" />
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Global Save Button */}
        <Button 
          type="submit" 
          disabled={saving}
          className="bg-maroon hover:bg-maroon-dark text-white rounded-none py-6 font-semibold uppercase tracking-wider text-xs shadow-lg flex items-center justify-center gap-2 w-full md:w-auto md:self-end px-8"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving changes..." : "Save Settings Changes"}
        </Button>
      </form>
    </div>
  );
}
