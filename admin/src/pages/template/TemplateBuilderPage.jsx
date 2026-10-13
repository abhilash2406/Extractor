import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TemplateBuilder from './builder/TemplateBuilder';
import { getTemplate, createTemplate, updateTemplate } from '@/api/templates.api';

export const TemplateBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        if (id) {
          const res = await getTemplate(id);
          if (res.data?.data) {
            setTemplate(res.data.data);
          } else {
            toast.error('Template not found.');
            navigate('/admin/templates', { replace: true });
            return;
          }
        } else {
          // Creating new template
          setTemplate(null);
        }
      } catch (e) {
        console.error('Failed to load template data', e);
        toast.error(e.response?.data?.message || 'Failed to load template data.');
        navigate('/admin/templates', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id, navigate]);

  const handleSave = async (payload, finalStatus) => {
    try {
      if (payload.id) {
        // Update existing template
        await updateTemplate(payload.id, {
          name: payload.name,
          code: payload.code,
          description: payload.description,
          category: payload.category,
          thumbnail_url: payload.thumbnail_url,
          status: finalStatus,
          layout_config: payload.layout_config,
          design_config: payload.design_config,
        });
      } else {
        // Create new template
        await createTemplate({
          name: payload.name,
          code: payload.code,
          description: payload.description,
          category: payload.category,
          thumbnail_url: payload.thumbnail_url,
          status: finalStatus,
          layout_config: payload.layout_config,
          design_config: payload.design_config,
        });
      }

      toast.success(
        `Template "${payload.name}" ${
          finalStatus === 'published' ? 'published' : 'saved'
        } successfully!`
      );
      navigate('/admin/templates');
    } catch (e) {
      console.error('Failed to save template', e);
      toast.error(e.response?.data?.message || 'Failed to save template.');
    }
  };

  const handleBack = () => {
    navigate('/admin/templates');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
          <span className="text-sm font-medium">Loading Template Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <TemplateBuilder
      initialTemplate={template}
      onSave={handleSave}
      onBack={handleBack}
    />
  );
};

export default TemplateBuilderPage;
